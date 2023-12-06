package dev.prometheus.grouping;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.beans.factory.annotation.Value;

@Configuration
public class SecurityConfiguration {
    @Value("${USERNAME}")
    private String username;
    @Value("${PASSWORD}")
    private String password;
    @Value("${ADMIN}")
    private String admin;
    @Value("${ADMINPW}")
    private String PW;



    @Bean
    public InMemoryUserDetailsManager userDetailsService() {
        UserDetails user = User.withDefaultPasswordEncoder()
                .username(username)
                .password(password)
                .roles("ADMIN")
                .build();
        UserDetails guest = User.withDefaultPasswordEncoder()
                .username("guest")
                .password("1234")
                .roles("USER")
                .build();
        UserDetails dev = User.withDefaultPasswordEncoder()
                .username(admin)
                .password(PW)
                .roles("DEV")
                .build();

        return new InMemoryUserDetailsManager(user, guest, dev);
    }

    @Bean
    public SecurityFilterChain securityFilterChain2(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests((authz) -> authz
                        .requestMatchers( "/admin/**").hasRole("DEV")
                        .requestMatchers( "/list/**").hasAnyRole("ADMIN" , "DEV")
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults());
        return http.build();
    }


}
