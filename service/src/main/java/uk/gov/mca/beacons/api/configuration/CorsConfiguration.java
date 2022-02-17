package uk.gov.mca.beacons.api.configuration;

import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfiguration {

  @Bean
  public WebMvcConfigurer corsConfigurer(
    @Value("${beacons.cors.allowedOrigins}") String[] allowedOrigins
  ) {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(@NotNull CorsRegistry registry) {
        if (allowedOrigins != null && allowedOrigins.length > 0) {
          registry
            .addMapping("/**")
            .allowedMethods("*")
            .allowedOrigins(allowedOrigins);
        }
      }
    };
  }
}
