package com.agripulse.api.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.utils.SpringDocUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZonedDateTime;

@Configuration
public class OpenApiConfig {

    private static final String SECURITY_SCHEME_NAME = "bearerAuth";

    static {
        SpringDocUtils.getConfig()
            .replaceWithSchema(LocalDate.class, new Schema<String>().type("string").format("date"))
            .replaceWithSchema(LocalTime.class, new Schema<String>().type("string").format("time"))
            .replaceWithSchema(LocalDateTime.class, new Schema<String>().type("string").format("date-time"))
            .replaceWithSchema(ZonedDateTime.class, new Schema<String>().type("string").format("date-time"));
    }

    @Bean
    public OpenAPI customConfig() {
        Info info = new Info()
            .title("AgriPulse Core API")
            .description("API documentation for the AgriPulse core service")
            .version("1.0");

        return new OpenAPI().info(info)
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME, new SecurityScheme()
                                .name(SECURITY_SCHEME_NAME)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Paste your Clerk session token here. Get it from the frontend with: await window.Clerk.session.getToken()")));
    }
}