package uk.gov.mca.beacons.api.auth.application;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uk.gov.mca.beacons.api.auth.gateway.AuthGateway;
import uk.gov.mca.beacons.api.shared.domain.user.User;

@Service
public class GetUserService {

  private final AuthGateway authGateway;

  @Autowired
  public GetUserService(AuthGateway authGateway) {
    this.authGateway = authGateway;
  }

  public User getUser() {
    return authGateway.getUser();
  }
}
