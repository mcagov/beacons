package uk.gov.mca.beacons.api.beacon.domain.events;

import java.util.Objects;
import org.springframework.lang.NonNull;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.shared.domain.base.DomainEvent;

public class BeaconCreated implements DomainEvent {

  private final Beacon beacon;

  public BeaconCreated(@NonNull Beacon beacon) {
    this.beacon = beacon;
  }

  @NonNull
  public BeaconId getBeaconId() {
    return Objects.requireNonNull(this.beacon.getId());
  }
}
