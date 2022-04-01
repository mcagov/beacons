package uk.gov.mca.beacons.api.export;

import java.util.List;
import java.util.Objects;
import java.util.UUID;
import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.lang.Nullable;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwner;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;

/**
 * Represents the contents of a spreadsheet export.
 *
 * File format agnostic: the same SpreadsheetRow may be used in a job to write to .csv, .xls, .xlsx etc.
 */
@Getter
@Setter
public class SpreadsheetRow {

  @Getter
  private static final List<String> columnAttributes = List.of(
    "id",
    "hexId",
    "ownerName"
  );

  @Getter
  private static final List<String> columnHeadings = List.of(
    "ID",
    "Hex ID",
    "Owner name"
  );

  @NotNull
  private final UUID id;

  private final String hexId;
  private final String ownerName;

  public SpreadsheetRow(LegacyBeacon legacyBeacon) {
    this.id = Objects.requireNonNull(legacyBeacon.getId()).unwrap();
    this.hexId = legacyBeacon.getHexId();
    this.ownerName = legacyBeacon.getOwnerName();
  }

  public SpreadsheetRow(Beacon beacon, @Nullable BeaconOwner beaconOwner) {
    this.id = Objects.requireNonNull(beacon.getId()).unwrap();
    this.hexId = beacon.getHexId();
    this.ownerName = beaconOwner != null ? beaconOwner.getFullName() : null;
  }
}
