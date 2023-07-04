package uk.gov.mca.beacons.api.accountholder.application;

import uk.gov.mca.beacons.api.shared.domain.user.User;

public interface AuthClient {
  void updateUser(User user);
  User getUser(String id);
  void deleteUser(String id);
}
