package com.landsafe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LandsafeApplication {

    public static void main(String[] args) {
        SpringApplication.run(LandsafeApplication.class, args);
    }
}
