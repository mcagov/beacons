package uk.gov.mca.beacons.api.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.core.mapping.RepositoryDetectionStrategy;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import uk.gov.mca.beacons.api.search.domain.BeaconSearchEntity;

@Configuration
public class SpringDataRestRepositoryConfiguration
  implements RepositoryRestConfigurer {

  @Value("${beacons.cors.allowedOrigins}")
  private String[] allowedOrigins;

  @Override
  public void configureRepositoryRestConfiguration(
    RepositoryRestConfiguration config,
    CorsRegistry cors
  ) {
    config.exposeIdsFor(BeaconSearchEntity.class);

    if (allowedOrigins != null && allowedOrigins.length > 0) {
      cors.addMapping("/**").allowedMethods("*").allowedOrigins(allowedOrigins);
    }

    config.setRepositoryDetectionStrategy(
      RepositoryDetectionStrategy.RepositoryDetectionStrategies.ANNOTATED
    );
  }
}
