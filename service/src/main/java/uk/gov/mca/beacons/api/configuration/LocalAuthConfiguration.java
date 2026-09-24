package uk.gov.mca.beacons.api.configuration;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.stereotype.Component;

@Profile("localauth")
@Component
public class LocalAuthConfiguration {

  @Value("${local-auth.id}")
  private String id;

  @Value("${local-auth.email}")
  private String email;

  @Value("${local-auth.name}")
  private String name;

  @Value("${local-auth.roles}")
  private String roles;

  public LocalAuthConfiguration(Environment environment) {
    if (
      !environment.acceptsProfiles(Profiles.of("dev")) ||
      environment.acceptsProfiles(Profiles.of("default | migration"))
    ) {
      throw new IllegalStateException(
        "The 'localauth' profile is for local development only: it must run with 'dev', and never with 'default' or 'migration'"
      );
    }
  }

  public UUID getId() {
    return UUID.fromString(id);
  }

  public String getEmail() {
    return email;
  }

  public String getName() {
    return name;
  }

  public List<String> getRoles() {
    return Arrays.stream(roles.split(","))
      .map(String::trim)
      .filter(role -> !role.isEmpty())
      .collect(Collectors.toList());
  }
}
