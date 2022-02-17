package uk.gov.mca.beacons.api.legacybeacon.application;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.OffsetDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import uk.gov.mca.beacons.api.BaseIntegrationTest;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyData;

public class LegacyBeaconServiceIntegrationTest extends BaseIntegrationTest {

  @Autowired
  LegacyBeaconService legacyBeaconService;

  @Test
  void shouldClaimLegacyBeacon() throws Exception {
    final String hexId = "9D0E1D1B8C00001";
    final String email = "ownerbeacon@beacons.com";
    LegacyBeacon legacyBeacon = initLegacyBeacon();
    legacyBeaconService.create(legacyBeacon);

    List<LegacyBeacon> claimedLegacyBeacons = legacyBeaconService.claimByHexIdAndAccountHolderEmail(
      hexId,
      email
    );

    assert claimedLegacyBeacons.get(0).isClaimed();
  }

  private LegacyData getLegacyBeaconData() throws Exception {
    ObjectMapper objectMapper = new ObjectMapper();

    return objectMapper.readValue(
      fixtureHelper.getFixture(
        "src/test/resources/fixtures/legacyBeaconData.json"
      ),
      LegacyData.class
    );
  }

  private LegacyBeacon initLegacyBeacon() throws Exception {
    LegacyBeacon legacyBeacon = new LegacyBeacon();
    LegacyData legacyData = getLegacyBeaconData();
    legacyBeacon.setBeaconStatus("MIGRATED");
    legacyBeacon.setHexId(legacyData.getBeacon().getHexId());
    legacyBeacon.setOwnerEmail(legacyData.getOwner().getEmail());
    legacyBeacon.setOwnerName(legacyData.getOwner().getOwnerName());
    legacyBeacon.setUseActivities("Testing testing 123");
    legacyBeacon.setData(legacyData);
    legacyBeacon.setCreatedDate(OffsetDateTime.now());
    legacyBeacon.setLastModifiedDate(OffsetDateTime.now());

    return legacyBeacon;
  }
}
