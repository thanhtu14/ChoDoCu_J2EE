package com.company.chodocu.config;

import com.company.chodocu.security.JwtAuthenticationFilter;
import com.company.chodocu.security.ApiSecurityErrorWriter;
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
  @Bean
  PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  FilterRegistrationBean<JwtAuthenticationFilter> jwtFilterServletRegistration(JwtAuthenticationFilter filter) {
    FilterRegistrationBean<JwtAuthenticationFilter> registration = new FilterRegistrationBean<>(filter);
    registration.setEnabled(false);
    return registration;
  }

  @Bean
  SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwt,
      ApiSecurityErrorWriter errors) throws Exception {
    return http.csrf(c -> c.disable()).sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(a -> a
            .requestMatchers("/api/auth/**", "/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**",
                "/actuator/health")
            .permitAll()
            .requestMatchers(HttpMethod.GET, "/api/dia-chi/**", "/api/danh-muc", "/api/banner", "/api/dich-vu",
                "/api/bai-dang/**")
            .permitAll()
            .anyRequest().authenticated())
        .exceptionHandling(e -> e
            .authenticationEntryPoint((request, response, exception) -> errors.write(request, response,
                org.springframework.http.HttpStatus.UNAUTHORIZED, "Yêu cầu xác thực. Vui lòng đăng nhập."))
            .accessDeniedHandler((request, response, exception) -> errors.write(request, response,
                org.springframework.http.HttpStatus.FORBIDDEN, "Bạn không có quyền thực hiện thao tác này.")))
        .addFilterBefore(jwt, UsernamePasswordAuthenticationFilter.class).build();
  }
}
