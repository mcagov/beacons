package uk.gov.mca.beacons.api.beaconowner.application;

import java.util.List;
import java.util.Optional;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwner;

public class BeaconOwnerHelper {

  public static Optional<BeaconOwner> getMainOwner(
    List<BeaconOwner> beaconOwners
  ) {
    if (beaconOwners.isEmpty()) {
      return Optional.empty();
    }

    Optional<BeaconOwner> mainBeaconOwner = beaconOwners
      .stream()
      .filter(BeaconOwner::isMain)
      .findFirst();

    return mainBeaconOwner.or(() -> beaconOwners.stream().findFirst());
  }
}
