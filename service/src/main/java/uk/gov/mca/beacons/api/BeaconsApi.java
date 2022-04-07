package uk.gov.mca.beacons.api;

import java.time.Clock;
import net.javacrumbs.shedlock.spring.annotation.EnableSchedulerLock;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableSchedulerLock(defaultLockAtMostFor = "PT30S")
public class BeaconsApi {

  public static void main(String[] args) {
    SpringApplication.run(BeaconsApi.class, args);
  }

  @Bean
  Clock clock() {
    return Clock.systemDefaultZone();
  }
}
