package uk.gov.mca.beacons.api.auth.gateway;

import java.util.List;
import uk.gov.mca.beacons.api.auth.gateway.AuthGatewayImpl.SupportedPermissions;
import uk.gov.mca.beacons.api.shared.domain.user.User;

public interface AuthGateway {
  User getUser();

  List<SupportedPermissions> getUserRoles();
}
