package uk.gov.mca.beacons.api.configuration;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfiguration {

  private static final String GITHUB_LICENSE_SUFFIX = "/blob/main/LICENCE";

  @Bean
  public OpenAPI beaconsOpenApiConfig(
    @Value("${beacons.openapi.github.url}") String gitHubUrl
  ) {
    return new OpenAPI()
      .info(
        new Info()
          .title("Beacons API")
          .description("OpenAPI 3 definition for the Beacons API")
          .license(
            new License().name(("MIT")).url(gitHubUrl + GITHUB_LICENSE_SUFFIX)
          )
      )
      .externalDocs(
        new ExternalDocumentation().description("GitHub").url(gitHubUrl)
      );
  }
}
