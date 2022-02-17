package uk.gov.mca.beacons.api.beaconowner.domain;

import java.util.UUID;
import uk.gov.mca.beacons.api.shared.domain.base.DomainObjectId;

public class BeaconOwnerId extends DomainObjectId {

  public BeaconOwnerId(UUID id) {
    super(id);
  }
}
