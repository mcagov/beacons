package uk.gov.mca.beacons.service.configuration;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import uk.gov.mca.beacons.service.model.BeaconsSearchResult;
import uk.gov.mca.beacons.service.serializer.BeaconsSearchResultSerializer;

@Configuration
public class JacksonConfiguration {

  @Bean
  public ObjectMapper objectMapper() {
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.configure(
      DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,
      true
    );
    objectMapper.registerModule(new JavaTimeModule());

    SimpleModule module = new SimpleModule();
    module.addSerializer(
      BeaconsSearchResult.class,
      new BeaconsSearchResultSerializer()
    );
    objectMapper.registerModule(module);

    return objectMapper;
  }
}
