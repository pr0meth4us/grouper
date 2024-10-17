package dev.prometheus.grouping;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
public class SecurityConfiguration {
    @Value("${USERNAME}")
    private String username;
    @Value("${PASSWORD}")
    private String password;
    @Value("${GUEST_USERNAME}")
    private String guestUsername;
    @Value("${GUEST_PASSWORD}")
    private String guestPassword;
    @Value("${DEV_USERNAME}")
    private String devUsername;
    @Value("${DEV_PASSWORD}")
    private String devPassword;
    @Value("${client.origin:http://localhost:3000}")  // Default value provided
    private String clientOrigin;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        UserDetails user = org.springframework.security.core.userdetails.User.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .roles("USER")
                .build();
        UserDetails guest = org.springframework.security.core.userdetails.User.builder()
                .username(guestUsername)
                .password(passwordEncoder.encode(guestPassword))
                .roles("GUEST")
                .build();
        UserDetails dev = org.springframework.security.core.userdetails.User.builder()
                .username(devUsername)
                .password(passwordEncoder.encode(devPassword))
                .roles("DEV")
                .build();
        return new InMemoryUserDetailsManager(user, guest, dev);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .authorizeHttpRequests((authz) -> authz
                        .requestMatchers("/list/**", "/exclude/**").hasAnyRole("USER", "DEV")
                        .requestMatchers("/list/").hasAnyRole("GUEST", "USER", "DEV")
                        .requestMatchers("/admin/**").hasRole("DEV")
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults());
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedOrigins(Collections.singletonList(clientOrigin));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}