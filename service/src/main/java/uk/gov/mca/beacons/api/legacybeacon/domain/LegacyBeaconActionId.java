package uk.gov.mca.beacons.api.legacybeacon.domain;

import java.util.UUID;
import uk.gov.mca.beacons.api.shared.domain.base.DomainObjectId;

public class LegacyBeaconActionId extends DomainObjectId {

  public LegacyBeaconActionId(UUID id) {
    super(id);
  }
}
