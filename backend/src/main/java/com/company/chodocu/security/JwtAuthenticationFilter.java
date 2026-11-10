package com.company.chodocu.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final byte[] key; private final String issuer, audience;
    public JwtAuthenticationFilter(@Value("${app.jwt.key}") String key, @Value("${app.jwt.issuer:ChoDoCu}") String issuer, @Value("${app.jwt.audience:ChoDoCu.Client}") String audience) {
        this.key=key.getBytes(StandardCharsets.UTF_8); this.issuer=issuer; this.audience=audience;
    }
    @Override protected void doFilterInternal(HttpServletRequest request,HttpServletResponse response,FilterChain chain) throws ServletException,IOException {
        String h=request.getHeader("Authorization");
        if(h!=null && h.startsWith("Bearer ")) try {
            Claims c=Jwts.parser().verifyWith(Keys.hmacShaKeyFor(key)).requireIssuer(issuer).requireAudience(audience).build().parseSignedClaims(h.substring(7)).getPayload();
            List<SimpleGrantedAuthority> authorities=new ArrayList<>();
            Object rs=c.get("roles"); if(rs instanceof Collection<?> values) values.forEach(v->authorities.add(new SimpleGrantedAuthority("ROLE_"+v)));
            Object ps=c.get("permissions"); if(ps instanceof Collection<?> values) values.forEach(v->authorities.add(new SimpleGrantedAuthority(String.valueOf(v))));
            var auth=new UsernamePasswordAuthenticationToken(c.getSubject(),null,authorities);
            SecurityContextHolder.getContext().setAuthentication(auth);
        } catch (RuntimeException ignored) { SecurityContextHolder.clearContext(); }
        chain.doFilter(request,response);
    }
}
