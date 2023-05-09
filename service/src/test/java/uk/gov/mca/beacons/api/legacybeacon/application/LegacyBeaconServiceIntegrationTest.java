package uk.gov.mca.beacons.api.legacybeacon.application;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import uk.gov.mca.beacons.api.BaseIntegrationTest;
import uk.gov.mca.beacons.api.legacybeacon.LegacyBeaconTestUtils;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;

public class LegacyBeaconServiceIntegrationTest extends BaseIntegrationTest {

  @Autowired
  LegacyBeaconService legacyBeaconService;

  @Test
  void shouldClaimLegacyBeacon() throws Exception {
    LegacyBeacon legacyBeacon = LegacyBeaconTestUtils.initLegacyBeacon();
    legacyBeaconService.create(legacyBeacon);

    LegacyBeacon claimedLegacyBeacon = legacyBeaconService.claimByHexIdAndAccountHolderEmail(
      legacyBeacon
    );

    assert claimedLegacyBeacon.isClaimed();
  }
}
