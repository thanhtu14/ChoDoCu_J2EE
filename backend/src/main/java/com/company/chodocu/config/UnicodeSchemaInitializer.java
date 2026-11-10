package com.company.chodocu.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.io.InputStreamReader;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;

/** Applies the idempotent SQL Server Unicode column migration before data seeders run. */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class UnicodeSchemaInitializer implements ApplicationRunner {
    private final JdbcTemplate jdbcTemplate;

    public UnicodeSchemaInitializer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        var script = new ClassPathResource("db/manual/V4__unicode_text_columns.sql");
        String sql;
        try (var reader = new InputStreamReader(script.getInputStream(), StandardCharsets.UTF_8)) {
            var writer = new StringWriter();
            reader.transferTo(writer);
            sql = writer.toString();
        }
        jdbcTemplate.execute(sql);
    }
}
