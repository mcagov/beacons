package uk.gov.mca.beacons.api.legacybeacon.domain.events;

import java.util.Objects;
import org.springframework.lang.NonNull;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeaconId;
import uk.gov.mca.beacons.api.shared.domain.base.DomainEvent;

public class LegacyBeaconDeleted implements DomainEvent {

  private final LegacyBeacon legacyBeacon;

  public LegacyBeaconDeleted(@NonNull LegacyBeacon legacyBeacon) {
    this.legacyBeacon = legacyBeacon;
  }

  @NonNull
  public LegacyBeaconId getLegacyBeaconId() {
    return Objects.requireNonNull(legacyBeacon.getId());
  }
}
