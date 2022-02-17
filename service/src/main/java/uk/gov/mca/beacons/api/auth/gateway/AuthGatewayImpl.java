package uk.gov.mca.beacons.api.auth.gateway;

import com.azure.spring.aad.webapi.AADOAuth2AuthenticatedPrincipal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.auth.domain.BackOfficeUser;
import uk.gov.mca.beacons.api.shared.domain.user.User;

@Component
public class AuthGatewayImpl implements AuthGateway {

  @Override
  public User getUser() {
    final var authentication = getAuthentication();
    final var user = (AADOAuth2AuthenticatedPrincipal) authentication.getPrincipal();
    final var userAttributes = user.getAttributes();

    final UUID userId = UUID.fromString((String) userAttributes.get("oid"));
    final String name = (String) userAttributes.get("name");
    final String email = (String) userAttributes.get("email");

    return BackOfficeUser
      .builder()
      .id(userId)
      .fullName(name)
      .email(email)
      .build();
  }

  @Override
  public List<SupportedPermissions> getUserRoles() {
    final var authentication = getAuthentication();

    if (authentication == null) return new ArrayList<>();

    return authentication
      .getAuthorities()
      .stream()
      .map(this::SupportedPermissionsFromString)
      .filter(Objects::nonNull)
      .collect(Collectors.toList());
  }

  private Authentication getAuthentication() {
    return SecurityContextHolder.getContext().getAuthentication();
  }

  private SupportedPermissions SupportedPermissionsFromString(
    GrantedAuthority role
  ) {
    try {
      return SupportedPermissions.valueOf(role.toString());
    } catch (IllegalArgumentException e) {
      return null;
    }
  }

  public enum SupportedPermissions {
    APPROLE_UPDATE_RECORDS,
  }
}
