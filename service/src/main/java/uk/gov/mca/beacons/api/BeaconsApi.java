package uk.gov.mca.beacons.api;

import java.time.Clock;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BeaconsApi {

  public static void main(String[] args) {
    SpringApplication.run(BeaconsApi.class, args);
  }

  @Bean
  Clock clock() {
    return Clock.systemDefaultZone();
  }
}
