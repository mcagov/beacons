package uk.gov.mca.beacons.api.auth.application;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.core.Is.is;
import static org.mockito.BDDMockito.given;

import java.util.ArrayList;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mca.beacons.api.auth.application.BeaconRolesService;
import uk.gov.mca.beacons.api.auth.gateway.AuthGateway;
import uk.gov.mca.beacons.api.auth.gateway.AuthGatewayImpl.SupportedPermissions;

@ExtendWith(MockitoExtension.class)
class BeaconRolesServiceTest {

  @InjectMocks
  private BeaconRolesService beaconRolesService;

  @Mock
  private AuthGateway authGateway;

  @Test
  void shouldReturnNoPermissionsForRolelessUser() {
    given(authGateway.getUserRoles()).willReturn(new ArrayList<>());
    var roles = beaconRolesService.getUserRoles();

    assertThat(roles, is(empty()));
  }

  @Test
  void shouldReturnPermissionForUpdateRecordsUser() {
    final var userRoles = new ArrayList<SupportedPermissions>();
    userRoles.add(SupportedPermissions.APPROLE_UPDATE_RECORDS);

    given(authGateway.getUserRoles()).willReturn(userRoles);
    var roles = beaconRolesService.getUserRoles();

    assertThat(roles.size(), is(1));
    assertThat(
      roles.contains(SupportedPermissions.APPROLE_UPDATE_RECORDS),
      is(true)
    );
  }
}
