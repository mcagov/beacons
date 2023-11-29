package uk.gov.mca.beacons.api.beaconuse.domain.events;

import org.springframework.lang.NonNull;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.shared.domain.base.DomainEvent;

public class BeaconUseUpdated implements DomainEvent {

  private final BeaconUse beaconUse;

  public BeaconUseUpdated(@NonNull BeaconUse beaconUse) {
    this.beaconUse = beaconUse;
  }
}
