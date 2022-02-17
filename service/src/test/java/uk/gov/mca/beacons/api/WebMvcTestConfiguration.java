package uk.gov.mca.beacons.api;

import org.springframework.context.annotation.Bean;
import uk.gov.mca.beacons.api.mappers.ValidationErrorMapper;
import uk.gov.mca.beacons.api.mappers.ValidationErrorMapperImpl;

public class WebMvcTestConfiguration {

  @Bean
  public ValidationErrorMapper getValidationErrorResponseService() {
    return new ValidationErrorMapperImpl();
  }
}
