package uk.gov.mca.beacons.api.legacybeacon.application;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.OffsetDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import uk.gov.mca.beacons.api.BaseIntegrationTest;
import uk.gov.mca.beacons.api.legacybeacon.LegacyBeaconTestUtils;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeaconDetails;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyData;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyOwner;

public class LegacyBeaconServiceIntegrationTest extends BaseIntegrationTest {

  @Autowired
  LegacyBeaconService legacyBeaconService;

  @Test
  void shouldClaimLegacyBeacon() throws Exception {
    final String hexId = "9D0E1D1B8C00001";
    final String email = "ownerbeacon@beacons.com";
    LegacyBeacon legacyBeacon = LegacyBeaconTestUtils.initLegacyBeacon();
    legacyBeaconService.create(legacyBeacon);

    List<LegacyBeacon> claimedLegacyBeacons = legacyBeaconService.claimByHexIdAndAccountHolderEmail(
      hexId,
      email
    );

    assert claimedLegacyBeacons.get(0).isClaimed();
  }
}
