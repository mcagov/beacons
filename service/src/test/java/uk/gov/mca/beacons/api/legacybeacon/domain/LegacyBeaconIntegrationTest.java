package uk.gov.mca.beacons.api.legacybeacon.domain;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.OffsetDateTime;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import uk.gov.mca.beacons.api.BaseIntegrationTest;
import uk.gov.mca.beacons.api.FixtureHelper;

public class LegacyBeaconIntegrationTest extends BaseIntegrationTest {

  @Autowired
  LegacyBeaconRepository legacyBeaconRepository;

  @Test
  void shouldSaveALegacyBeaconWithoutActions() throws Exception {
    LegacyBeacon legacyBeacon = initLegacyBeacon();
    LegacyBeacon savedLegacyBeacon = legacyBeaconRepository.save(legacyBeacon);

    assert savedLegacyBeacon.getId() != null;
  }

  @Test
  void shouldClaimALegacyBeacon() throws Exception {
    LegacyBeacon unclaimedLegacyBeacon = initLegacyBeacon();
    LegacyBeacon legacyBeacon = legacyBeaconRepository.save(
      unclaimedLegacyBeacon
    );

    assert !legacyBeacon.isClaimed();

    legacyBeacon.claim();

    LegacyBeacon claimedLegacyBeacon = legacyBeaconRepository.save(
      legacyBeacon
    );

    assert claimedLegacyBeacon.isClaimed();
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
