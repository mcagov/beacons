package uk.gov.mca.beacons.api.auth.gateway;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.auth.domain.BackOfficeUser;
import uk.gov.mca.beacons.api.configuration.LocalAuthConfiguration;
import uk.gov.mca.beacons.api.shared.domain.user.User;

@Slf4j
@Profile("localauth")
@Component
public class LocalAuthGateway implements AuthGateway {

  private final LocalAuthConfiguration config;

  public LocalAuthGateway(LocalAuthConfiguration config) {
    this.config = config;
    log.warn(
      "The 'localauth' profile is active: all requests are attributed to {} and no access token is verified",
      config.getEmail()
    );
  }

  @Override
  public User getUser() {
    return BackOfficeUser.builder()
      .id(config.getId())
      .fullName(config.getName())
      .email(config.getEmail())
      .build();
  }

  @Override
  public List<AuthGatewayImpl.SupportedPermissions> getUserRoles() {
    return config
      .getRoles()
      .stream()
      .map(this::supportedPermissionFromRoleName)
      .filter(Objects::nonNull)
      .collect(Collectors.toList());
  }

  private AuthGatewayImpl.SupportedPermissions supportedPermissionFromRoleName(
    String roleName
  ) {
    try {
      return AuthGatewayImpl.SupportedPermissions.valueOf(
        "APPROLE_" + roleName
      );
    } catch (IllegalArgumentException e) {
      log.warn("Ignoring unrecognised local-auth role {}", roleName);
      return null;
    }
  }
}
