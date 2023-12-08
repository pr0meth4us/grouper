package dev.prometheus.grouping;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

@Configuration
@PropertySource("classpath:application.properties")
public class Human {

    @Value("${MONGO_URI}")
    private String mongoUri;

    @Value("${KITTIE}")
    private String kittie;

    @Value("${DOGIE}")
    private String dogie;

    @Value("${NOODLE}")
    private String noodle;

    public String getMongoUri() {
        return mongoUri;
    }

    public String getKittie() {
        return kittie;
    }

    public String getDogie() {
        return dogie;
    }

    public String getNoodle() {
        return noodle;
    }

    public static void main(String[] args) {
        Human human = new Human();  // Create an instance of Human
        System.out.println("Kittie: " + human.getKittie());
        System.out.println("Noodle: " + human.getNoodle());
        System.out.println("Dogie: " + human.getDogie());
    }
}
