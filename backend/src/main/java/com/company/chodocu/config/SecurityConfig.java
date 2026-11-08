package com.company.chodocu.config;

import com.company.chodocu.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.http.HttpMethod;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
    @Bean PasswordEncoder passwordEncoder(){ return new BCryptPasswordEncoder(); }
    @Bean FilterRegistrationBean<JwtAuthenticationFilter> jwtFilterServletRegistration(JwtAuthenticationFilter filter){
        FilterRegistrationBean<JwtAuthenticationFilter> registration=new FilterRegistrationBean<>(filter);
        registration.setEnabled(false);
        return registration;
    }
    @Bean SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwt) throws Exception {
        return http.csrf(c->c.disable()).sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
          .authorizeHttpRequests(a->a
            .requestMatchers("/api/auth/**","/swagger-ui/**","/swagger-ui.html","/v3/api-docs/**","/actuator/health").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/dia-chi/**", "/api/danh-muc", "/api/banner", "/api/dich-vu").permitAll()
            .anyRequest().authenticated())
          .addFilterBefore(jwt, UsernamePasswordAuthenticationFilter.class).build();
    }
}
