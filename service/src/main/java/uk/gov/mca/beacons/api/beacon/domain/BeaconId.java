package uk.gov.mca.beacons.api.beacon.domain;

import java.util.UUID;
import uk.gov.mca.beacons.api.shared.domain.base.DomainObjectId;

public class BeaconId extends DomainObjectId {

  public BeaconId(UUID id) {
    super(id);
  }
}
