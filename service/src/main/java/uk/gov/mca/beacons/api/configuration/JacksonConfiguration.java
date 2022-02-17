package uk.gov.mca.beacons.api.configuration;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.util.StdDateFormat;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.util.TimeZone;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfiguration {

  @Bean
  public ObjectMapper objectMapper() {
    final ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.configure(
      DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,
      true
    );
    objectMapper.registerModule(new JavaTimeModule());
    objectMapper.setDateFormat(new StdDateFormat().withColonInTimeZone(true));
    objectMapper.setTimeZone(TimeZone.getTimeZone("GMT"));

    return objectMapper;
  }
}
