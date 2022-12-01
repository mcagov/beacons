package uk.gov.mca.beacons.api.legacybeacon;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.OffsetDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import uk.gov.mca.beacons.api.FixtureHelper;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyData;

public class LegacyBeaconTestUtils {

  protected static FixtureHelper fixtureHelper = new FixtureHelper();

  public static LegacyBeacon initLegacyBeacon() throws Exception {
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

  private static LegacyData getLegacyBeaconData() throws Exception {
    ObjectMapper objectMapper = new ObjectMapper();

    return objectMapper.readValue(
      fixtureHelper.getFixture(
        "src/test/resources/fixtures/legacyBeaconData.json"
      ),
      LegacyData.class
    );
  }
}
