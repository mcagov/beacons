package uk.gov.mca.beacons.api.auth.gateway;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.is;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static uk.gov.mca.beacons.api.auth.gateway.AuthGatewayImpl.SupportedPermissions;

import com.azure.spring.aad.webapi.AADOAuth2AuthenticatedPrincipal;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import org.hamcrest.core.Is;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import uk.gov.mca.beacons.api.shared.domain.user.User;

@ExtendWith(MockitoExtension.class)
class AuthGatewayImplTest {

  private AuthGateway authGateway;

  SimpleGrantedAuthority updaterAuth = new SimpleGrantedAuthority(
    SupportedPermissions.APPROLE_UPDATE_RECORDS.toString()
  );
  SimpleGrantedAuthority unsupportedAuth1 = new SimpleGrantedAuthority(
    "JUNK_AUTH_1"
  );
  SimpleGrantedAuthority unsupportedAuth2 = new SimpleGrantedAuthority(
    "JUNK_AUTH_2"
  );

  Authentication authentication = mock(Authentication.class);
  SecurityContext context = mock(SecurityContext.class);
  AADOAuth2AuthenticatedPrincipal principal = mock(
    AADOAuth2AuthenticatedPrincipal.class
  );

  @BeforeEach
  void before() {
    given(context.getAuthentication()).willReturn(authentication);
    given(authentication.getPrincipal()).willReturn(principal);
    SecurityContextHolder.setContext(context);
    authGateway = new AuthGatewayImpl();
  }

  @Nested
  class GetUser {

    @Test
    void getsUserAttributesAndCreatesUser() {
      final String userId = "0fd158e9-d648-4b11-88d9-7bc57080aa5e";
      final String fullName = "Marie Antoinette";
      final String email = "let.them.eat@cake.fr";

      final var mockPrincipal = new HashMap<String, Object>();
      mockPrincipal.put("oid", userId);
      mockPrincipal.put("name", fullName);
      mockPrincipal.put("email", email);
      given(principal.getAttributes()).willReturn(mockPrincipal);

      User user = authGateway.getUser();

      assertThat(user.getFullName(), is(fullName));
      assertThat(user.getEmail(), is(email));
    }
  }

  @Nested
  class GetUserRoles {

    @Test
    void shouldReturnNoPermissionsForNullAuth() {
      given(context.getAuthentication()).willReturn(null);

      var roles = authGateway.getUserRoles();

      assertThat(roles, Is.is(empty()));
    }

    @Test
    void shouldReturnNoPermissionsForRolelessUser() {
      var roles = authGateway.getUserRoles();
      assertThat(roles, Is.is(empty()));
    }

    @Test
    void shouldReturnPermissionForUpdateRecordsUser() {
      doReturn(List.of(updaterAuth)).when(authentication).getAuthorities();

      var roles = authGateway.getUserRoles();

      assertThat(roles.size(), Is.is(1));
    }

    @Test
    void shouldReturnPermissionForUpdateRecordsUserAndIgnoreUnsupportedPermissions() {
      doReturn(List.of(unsupportedAuth1, updaterAuth, unsupportedAuth2))
        .when(authentication)
        .getAuthorities();

      var roles = authGateway.getUserRoles();

      assertThat(roles.size(), Is.is(1));
    }

    @Test
    void shouldReturnIgnoreUnsupportedPermissions() {
      doReturn(List.of(unsupportedAuth1, unsupportedAuth2))
        .when(authentication)
        .getAuthorities();

      var roles = authGateway.getUserRoles();

      assertThat(roles, Is.is(empty()));
    }
  }
}
