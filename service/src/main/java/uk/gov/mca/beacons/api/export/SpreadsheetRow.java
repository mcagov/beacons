package uk.gov.mca.beacons.api.export;

import java.util.Objects;
import java.util.UUID;
import javax.validation.constraints.NotNull;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwner;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;

public class SpreadsheetRow {
    private @NotNull final UUID id;
    private final String hexId;
    private final String ownerName;

    public SpreadsheetRow(LegacyBeacon legacyBeacon) {
        this.id = Objects.requireNonNull(legacyBeacon.getId()).unwrap();
        this.hexId = legacyBeacon.getHexId();
        this.ownerName = legacyBeacon.getOwnerName();
    }

    public SpreadsheetRow(Beacon beacon, BeaconOwner beaconOwner) {
        this.id = Objects.requireNonNull(beacon.getId()).unwrap();
        this.hexId = beacon.getHexId();
        this.ownerName = beaconOwner.getFullName();
    }
}
