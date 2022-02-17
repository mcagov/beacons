package uk.gov.mca.beacons.api.configuration;

import java.time.OffsetDateTime;
import java.util.Optional;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.auditing.DateTimeProvider;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableJpaAuditing(dateTimeProviderRef = "auditingDateTimeProvider")
public class JpaConfiguration {

  /**
   * This bean is required as Spring Boot does not support auditing of {@link OffsetDateTime} instances.
   * We need to provide a date time provider which resolves to an instance of OffsetDateTime.now() which is used for setting
   * created and modified dates.
   */
  @Bean(name = "auditingDateTimeProvider")
  public DateTimeProvider dateTimeProvider() {
    return () -> Optional.of(OffsetDateTime.now());
  }
}
