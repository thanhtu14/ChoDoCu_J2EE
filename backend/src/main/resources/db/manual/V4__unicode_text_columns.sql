-- Idempotent SQL Server migration, executed at backend startup by
-- UnicodeSchemaInitializer. Convert every remaining VARCHAR column to NVARCHAR,
-- temporarily preserving dependent checks, defaults, and rowstore indexes.
SET XACT_ABORT ON;
BEGIN TRANSACTION;

SELECT c.object_id, c.column_id, s.name COLLATE DATABASE_DEFAULT AS schema_name,
       t.name COLLATE DATABASE_DEFAULT AS table_name,
       c.name COLLATE DATABASE_DEFAULT AS column_name, c.max_length, c.is_nullable
INTO #varchar_columns
FROM sys.columns c
JOIN sys.tables t ON t.object_id = c.object_id
JOIN sys.schemas s ON s.schema_id = t.schema_id
JOIN sys.types ty ON ty.user_type_id = c.user_type_id
WHERE ty.name = N'varchar' AND t.is_ms_shipped = 0;

-- SQL Server does not permit changing the type while a foreign key references
-- the column. The current schema has no varchar foreign keys; fail safely if
-- one is introduced so it can be migrated on both sides together.
IF EXISTS (
    SELECT 1
    FROM sys.foreign_key_columns fkc
    JOIN #varchar_columns vc
      ON (vc.object_id = fkc.parent_object_id AND vc.column_id = fkc.parent_column_id)
      OR (vc.object_id = fkc.referenced_object_id AND vc.column_id = fkc.referenced_column_id)
)
    THROW 51000, 'V4 cannot convert a varchar column used by a foreign key; migrate both key columns together.', 1;

SELECT dc.parent_object_id AS object_id, dc.parent_column_id,
       dc.name COLLATE DATABASE_DEFAULT AS name,
       dc.definition COLLATE DATABASE_DEFAULT AS definition
INTO #defaults
FROM sys.default_constraints dc
JOIN #varchar_columns vc ON vc.object_id = dc.parent_object_id AND vc.column_id = dc.parent_column_id;

SELECT cc.parent_object_id AS object_id,
       cc.name COLLATE DATABASE_DEFAULT AS name,
       cc.definition COLLATE DATABASE_DEFAULT AS definition,
       cc.is_disabled, cc.is_not_trusted
INTO #checks
FROM sys.check_constraints cc
JOIN #varchar_columns vc ON vc.object_id = cc.parent_object_id AND vc.column_id = cc.parent_column_id;

SELECT i.object_id, i.index_id, i.name COLLATE DATABASE_DEFAULT AS name,
       i.is_unique, i.type_desc COLLATE DATABASE_DEFAULT AS type_desc,
       i.is_unique_constraint, i.is_primary_key, i.is_disabled,
       i.filter_definition COLLATE DATABASE_DEFAULT AS filter_definition,
       STUFF((
           SELECT N', ' + QUOTENAME(c.name) +
                  CASE WHEN ic.is_descending_key = 1 THEN N' DESC' ELSE N' ASC' END
           FROM sys.index_columns ic
           JOIN sys.columns c ON c.object_id = ic.object_id AND c.column_id = ic.column_id
           WHERE ic.object_id = i.object_id AND ic.index_id = i.index_id
             AND ic.key_ordinal > 0
           ORDER BY ic.key_ordinal
           FOR XML PATH(N''), TYPE
       ).value(N'.', N'nvarchar(max)'), 1, 2, N'') COLLATE DATABASE_DEFAULT AS key_columns,
       STUFF((
           SELECT N', ' + QUOTENAME(c.name)
           FROM sys.index_columns ic
           JOIN sys.columns c ON c.object_id = ic.object_id AND c.column_id = ic.column_id
           WHERE ic.object_id = i.object_id AND ic.index_id = i.index_id
             AND ic.is_included_column = 1
           ORDER BY ic.index_column_id
           FOR XML PATH(N''), TYPE
       ).value(N'.', N'nvarchar(max)'), 1, 2, N'') COLLATE DATABASE_DEFAULT AS include_columns
INTO #indexes
FROM sys.indexes i
WHERE i.name IS NOT NULL AND i.is_hypothetical = 0
  AND i.type IN (1, 2)
  AND EXISTS (
      SELECT 1
      FROM sys.index_columns ic
      JOIN #varchar_columns vc ON vc.object_id = ic.object_id AND vc.column_id = ic.column_id
      WHERE ic.object_id = i.object_id AND ic.index_id = i.index_id
  );

DECLARE @sql nvarchar(max);

DECLARE defaults_cursor CURSOR LOCAL FAST_FORWARD FOR
    SELECT N'ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(object_id)) COLLATE DATABASE_DEFAULT + N'.' +
           QUOTENAME(OBJECT_NAME(object_id)) COLLATE DATABASE_DEFAULT + N' DROP CONSTRAINT ' + QUOTENAME(name) COLLATE DATABASE_DEFAULT + N';'
    FROM #defaults;
OPEN defaults_cursor;
FETCH NEXT FROM defaults_cursor INTO @sql;
WHILE @@FETCH_STATUS = 0 BEGIN EXEC sys.sp_executesql @sql; FETCH NEXT FROM defaults_cursor INTO @sql; END;
CLOSE defaults_cursor;
DEALLOCATE defaults_cursor;

DECLARE checks_cursor CURSOR LOCAL FAST_FORWARD FOR
    SELECT N'ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(object_id)) COLLATE DATABASE_DEFAULT + N'.' +
           QUOTENAME(OBJECT_NAME(object_id)) COLLATE DATABASE_DEFAULT + N' DROP CONSTRAINT ' + QUOTENAME(name) COLLATE DATABASE_DEFAULT + N';'
    FROM #checks;
OPEN checks_cursor;
FETCH NEXT FROM checks_cursor INTO @sql;
WHILE @@FETCH_STATUS = 0 BEGIN EXEC sys.sp_executesql @sql; FETCH NEXT FROM checks_cursor INTO @sql; END;
CLOSE checks_cursor;
DEALLOCATE checks_cursor;

DECLARE indexes_cursor CURSOR LOCAL FAST_FORWARD FOR
    SELECT CASE WHEN is_primary_key = 1 OR is_unique_constraint = 1
                THEN N'ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(object_id)) COLLATE DATABASE_DEFAULT + N'.' +
                     QUOTENAME(OBJECT_NAME(object_id)) COLLATE DATABASE_DEFAULT + N' DROP CONSTRAINT ' + QUOTENAME(name) COLLATE DATABASE_DEFAULT + N';'
                ELSE N'DROP INDEX ' + QUOTENAME(name) COLLATE DATABASE_DEFAULT + N' ON ' +
                     QUOTENAME(OBJECT_SCHEMA_NAME(object_id)) COLLATE DATABASE_DEFAULT + N'.' + QUOTENAME(OBJECT_NAME(object_id)) COLLATE DATABASE_DEFAULT + N';'
           END
    FROM #indexes;
OPEN indexes_cursor;
FETCH NEXT FROM indexes_cursor INTO @sql;
WHILE @@FETCH_STATUS = 0 BEGIN EXEC sys.sp_executesql @sql; FETCH NEXT FROM indexes_cursor INTO @sql; END;
CLOSE indexes_cursor;
DEALLOCATE indexes_cursor;

DECLARE columns_cursor CURSOR LOCAL FAST_FORWARD FOR
    SELECT N'ALTER TABLE ' + QUOTENAME(schema_name) COLLATE DATABASE_DEFAULT + N'.' + QUOTENAME(table_name) COLLATE DATABASE_DEFAULT +
           N' ALTER COLUMN ' + QUOTENAME(column_name) COLLATE DATABASE_DEFAULT + N' NVARCHAR(' +
           CASE WHEN max_length = -1 OR max_length > 4000 THEN N'MAX'
                ELSE CONVERT(nvarchar(10), max_length) END + N') ' +
           CASE WHEN is_nullable = 1 THEN N'NULL;' ELSE N'NOT NULL;' END
    FROM #varchar_columns;
OPEN columns_cursor;
FETCH NEXT FROM columns_cursor INTO @sql;
WHILE @@FETCH_STATUS = 0 BEGIN EXEC sys.sp_executesql @sql; FETCH NEXT FROM columns_cursor INTO @sql; END;
CLOSE columns_cursor;
DEALLOCATE columns_cursor;

DECLARE defaults_restore CURSOR LOCAL FAST_FORWARD FOR
    SELECT N'ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(object_id)) COLLATE DATABASE_DEFAULT + N'.' +
           QUOTENAME(OBJECT_NAME(object_id)) COLLATE DATABASE_DEFAULT + N' ADD CONSTRAINT ' + QUOTENAME(name) COLLATE DATABASE_DEFAULT + N' DEFAULT ' +
           definition + N' FOR ' + QUOTENAME(COL_NAME(object_id, parent_column_id)) COLLATE DATABASE_DEFAULT + N';'
    FROM #defaults;
OPEN defaults_restore;
FETCH NEXT FROM defaults_restore INTO @sql;
WHILE @@FETCH_STATUS = 0 BEGIN EXEC sys.sp_executesql @sql; FETCH NEXT FROM defaults_restore INTO @sql; END;
CLOSE defaults_restore;
DEALLOCATE defaults_restore;

DECLARE checks_restore CURSOR LOCAL FAST_FORWARD FOR
    SELECT N'ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(ch.object_id)) COLLATE DATABASE_DEFAULT + N'.' +
           QUOTENAME(OBJECT_NAME(ch.object_id)) COLLATE DATABASE_DEFAULT +
           CASE WHEN ch.is_not_trusted = 1 THEN N' WITH NOCHECK ADD CONSTRAINT ' ELSE N' WITH CHECK ADD CONSTRAINT ' END +
           QUOTENAME(ch.name) COLLATE DATABASE_DEFAULT + N' CHECK ' + ch.definition + N';' +
           CASE WHEN ch.is_disabled = 1 THEN N' ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(ch.object_id)) COLLATE DATABASE_DEFAULT + N'.' +
                QUOTENAME(OBJECT_NAME(ch.object_id)) COLLATE DATABASE_DEFAULT + N' NOCHECK CONSTRAINT ' + QUOTENAME(ch.name) COLLATE DATABASE_DEFAULT + N';' ELSE N'' END
    FROM #checks ch;
OPEN checks_restore;
FETCH NEXT FROM checks_restore INTO @sql;
WHILE @@FETCH_STATUS = 0 BEGIN EXEC sys.sp_executesql @sql; FETCH NEXT FROM checks_restore INTO @sql; END;
CLOSE checks_restore;
DEALLOCATE checks_restore;

DECLARE indexes_restore CURSOR LOCAL FAST_FORWARD FOR
    SELECT CASE WHEN is_primary_key = 1 OR is_unique_constraint = 1
                THEN N'ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(object_id)) + N'.' +
                     QUOTENAME(OBJECT_NAME(object_id)) COLLATE DATABASE_DEFAULT + N' ADD CONSTRAINT ' + QUOTENAME(name) COLLATE DATABASE_DEFAULT +
                     CASE WHEN is_primary_key = 1 THEN N' PRIMARY KEY ' ELSE N' UNIQUE ' END +
                     type_desc + N' (' + key_columns + N');'
                ELSE N'CREATE ' + CASE WHEN is_unique = 1 THEN N'UNIQUE ' ELSE N'' END +
                     type_desc + N' INDEX ' + QUOTENAME(name) COLLATE DATABASE_DEFAULT + N' ON ' +
                     QUOTENAME(OBJECT_SCHEMA_NAME(object_id)) COLLATE DATABASE_DEFAULT + N'.' + QUOTENAME(OBJECT_NAME(object_id)) COLLATE DATABASE_DEFAULT +
                     N' (' + key_columns + N')' +
                     CASE WHEN include_columns IS NOT NULL THEN N' INCLUDE (' + include_columns + N')' ELSE N'' END +
                     CASE WHEN filter_definition IS NOT NULL THEN N' WHERE ' + filter_definition ELSE N'' END + N';'
           END +
           CASE WHEN is_disabled = 1 THEN N' ALTER INDEX ' + QUOTENAME(name) COLLATE DATABASE_DEFAULT + N' ON ' +
                QUOTENAME(OBJECT_SCHEMA_NAME(object_id)) COLLATE DATABASE_DEFAULT + N'.' + QUOTENAME(OBJECT_NAME(object_id)) COLLATE DATABASE_DEFAULT + N' DISABLE;' ELSE N'' END
    FROM #indexes;
OPEN indexes_restore;
FETCH NEXT FROM indexes_restore INTO @sql;
WHILE @@FETCH_STATUS = 0 BEGIN EXEC sys.sp_executesql @sql; FETCH NEXT FROM indexes_restore INTO @sql; END;
CLOSE indexes_restore;
DEALLOCATE indexes_restore;

COMMIT TRANSACTION;
