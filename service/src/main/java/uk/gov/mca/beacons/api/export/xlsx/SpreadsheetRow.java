package uk.gov.mca.beacons.api.export.xlsx;

import java.util.List;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwner;

public interface SpreadsheetRow {
  static final List<String> COLUMN_ATTRIBUTES = null;
  static final List<String> COLUMN_HEADINGS = null;
  void setOwnerDetails(BeaconOwner beaconOwner);
}
