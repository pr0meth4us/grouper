package dev.prometheus.grouping;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
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
    @Value("${client.origin}")
    private String clientOrigin;

    @Bean
    public InMemoryUserDetailsManager userDetailsService() {
        UserDetails user = User.withDefaultPasswordEncoder()
                .username(username)
                .password(password)
                .roles("USER")
                .build();
        UserDetails guest = User.withDefaultPasswordEncoder()
                .username(guestUsername)
                .password(guestPassword)
                .roles("GUEST")
                .build();
        UserDetails dev = User.withDefaultPasswordEncoder()
                .username(devUsername)
                .password(devPassword)
                .roles("DEV")
                .build();
        return new InMemoryUserDetailsManager(user, guest, dev);

    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(httpSecurityCorsConfigurer ->
                        httpSecurityCorsConfigurer.configurationSource(request ->
                                new CorsConfiguration().applyPermitDefaultValues()))
//                .exceptionHandling(exceptions -> exceptions
//                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .authorizeHttpRequests((authz) -> authz
                        .requestMatchers("/list/**", "/exclude/**").hasRole("USER")
                        .requestMatchers("/list/").hasRole("GUEST")
                        .requestMatchers("/list/**","/exclude/**", "/admin/**").hasRole("DEV")
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
