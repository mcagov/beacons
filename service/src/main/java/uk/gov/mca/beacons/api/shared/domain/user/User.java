package uk.gov.mca.beacons.api.shared.domain.user;

import java.util.UUID;

public interface User {
  UUID getUserId();
  String getFullName();
  String getEmail();
}
