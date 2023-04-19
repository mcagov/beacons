package uk.gov.mca.beacons.api.legacybeacon.domain;

import org.junit.jupiter.api.Test;
import uk.gov.mca.beacons.api.legacybeacon.LegacyBeaconTestUtils;

public class LegacyBeaconTest {

  @Test
  void getBeaconStatus_whenTheInitialBeaconStatusIsMigratedAndTheBeaconHasBeenClaimed_shouldReturnCLAIMED()
    throws Exception {
    LegacyBeacon legacyBeacon = LegacyBeaconTestUtils.initLegacyBeacon();
    legacyBeacon.claim();

    String beaconStatus = legacyBeacon.getBeaconStatus();

    assert beaconStatus == "CLAIMED";
  }

  @Test
  void getBeaconStatus_whenTheInitialBeaconStatusIsClaimedAndTheBeaconHasBeenClaimed_shouldReturnCLAIMED()
    throws Exception {
    LegacyBeacon legacyBeacon = LegacyBeaconTestUtils.initLegacyBeacon();
    legacyBeacon.setBeaconStatus("CLAIMED");
    legacyBeacon.claim();

    String beaconStatus = legacyBeacon.getBeaconStatus();

    assert beaconStatus == "CLAIMED";
  }

  @Test
  void getBeaconStatus_whenTheInitialBeaconStatusIsMigratedAndTheBeaconHasBeenSoftDeleted_shouldReturnDELETED()
    throws Exception {
    LegacyBeacon legacyBeacon = LegacyBeaconTestUtils.initLegacyBeacon();
    legacyBeacon.softDelete();

    String beaconStatus = legacyBeacon.getBeaconStatus();

    assert beaconStatus == "DELETED";
  }

  @Test
  void getBeaconStatus_whenTheInitialBeaconStatusIsMigratedAndNoActionsHaveHappened_shouldReturnMIGRATED()
    throws Exception {
    LegacyBeacon legacyBeacon = LegacyBeaconTestUtils.initLegacyBeacon();

    String beaconStatus = legacyBeacon.getBeaconStatus();

    assert beaconStatus == "MIGRATED";
  }
}
