package uk.gov.mca.beacons.api.configuration;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * The single fixed identity used when the {@code localauth} profile is active. Supplied by the
 * environment (see {@code .envrc.example}) so all three applications agree on the local developer.
 */
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

  public UUID getId() {
    return UUID.fromString(id);
  }

  public String getEmail() {
    return email;
  }

  public String getName() {
    return name;
  }

  /** Role names without the {@code APPROLE_} prefix that Azure AD applies. */
  public List<String> getRoles() {
    return Arrays.stream(roles.split(","))
      .map(String::trim)
      .filter(role -> !role.isEmpty())
      .collect(Collectors.toList());
  }
}
