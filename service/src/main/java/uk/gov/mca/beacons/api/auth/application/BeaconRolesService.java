package uk.gov.mca.beacons.api.auth.application;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uk.gov.mca.beacons.api.auth.gateway.AuthGateway;
import uk.gov.mca.beacons.api.auth.gateway.AuthGatewayImpl.SupportedPermissions;

@Service
public class BeaconRolesService {

  private final AuthGateway authGateway;

  @Autowired
  public BeaconRolesService(AuthGateway authGateway) {
    this.authGateway = authGateway;
  }

  public List<SupportedPermissions> getUserRoles() {
    return authGateway.getUserRoles();
  }
}
