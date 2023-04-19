package uk.gov.mca.beacons.api.legacybeacon;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.OffsetDateTime;
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
    legacyBeacon.setCreatedDate(
      OffsetDateTime.parse("2021-12-03T10:15:30+01:00")
    );
    legacyBeacon.setLastModifiedDate(
      OffsetDateTime.parse("2022-10-03T10:15:30+01:00")
    );

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
