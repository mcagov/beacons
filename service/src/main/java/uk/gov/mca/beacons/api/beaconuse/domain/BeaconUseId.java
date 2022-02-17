package uk.gov.mca.beacons.api.beaconuse.domain;

import java.util.UUID;
import uk.gov.mca.beacons.api.shared.domain.base.DomainObjectId;

public class BeaconUseId extends DomainObjectId {

  public BeaconUseId(UUID id) {
    super(id);
  }
}
