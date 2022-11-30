package uk.gov.mca.beacons.api.legacybeacon.application;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.OffsetDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import uk.gov.mca.beacons.api.BaseIntegrationTest;
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
    LegacyBeacon legacyBeacon = initLegacyBeacon();
    legacyBeaconService.create(legacyBeacon);

    List<LegacyBeacon> claimedLegacyBeacons = legacyBeaconService.claimByHexIdAndAccountHolderEmail(
      hexId,
      email
    );

    assert claimedLegacyBeacons.get(0).isClaimed();
  }

  @Test
  void delete_shouldMarkLegacyBeaconStatusAsDeleted() throws Exception {
    final String hexId = "9D0E1D1B8C00001";
    final String email = "ownerbeacon@beacons.com";
    LegacyBeacon legacyBeacon = initLegacyBeacon();
    legacyBeaconService.create(legacyBeacon);

    List<LegacyBeacon> deletedLegacyBeacons = legacyBeaconService.delete(
      hexId,
      email,
      "The Beacon Registry Team deleted the record with reason: 'Duplicate'"
    );

    assert deletedLegacyBeacons.get(0).getBeaconStatus() == "DELETED";
  }

  @Test
  void delete_shouldRemoveAllTheOwnersPersonallyIdentifiableInformation()
    throws Exception {
    final String hexId = "9D0E1D1B8C00001";
    final String email = "ownerbeacon@beacons.com";
    LegacyBeacon legacyBeacon = initLegacyBeacon();
    legacyBeaconService.create(legacyBeacon);

    List<LegacyBeacon> deletedLegacyBeacons = legacyBeaconService.delete(
      hexId,
      email,
      "The Beacon Registry Team deleted the record with reason: 'Destroyed'"
    );

    LegacyBeacon deletedLegacyBeacon = deletedLegacyBeacons.get(0);
    LegacyOwner ownerData = legacyBeacon.getData().getOwner();

    assert ownerData.getAddress1() == null;
    assert ownerData.getOwnerName() == null;
    assert ownerData.getEmail() == null;
  }

  @Test
  void delete_shouldMarkTheBeaconAsWithdrawnAndAddTheDeletionReasonAsAWithdrawnReason()
    throws Exception {
    final String hexId = "9D0E1D1B8C00001";
    final String email = "ownerbeacon@beacons.com";
    LegacyBeacon legacyBeacon = initLegacyBeacon();
    legacyBeaconService.create(legacyBeacon);

    List<LegacyBeacon> deletedLegacyBeacons = legacyBeaconService.delete(
      hexId,
      email,
      "The Beacon Registry Team deleted the record with reason: 'Incorrectly registered'"
    );

    LegacyBeacon deletedLegacyBeacon = deletedLegacyBeacons.get(0);
    LegacyBeaconDetails beaconDetails = legacyBeacon.getData().getBeacon();

    assert beaconDetails.getIsWithdrawn() == "Y";
    assert beaconDetails.getWithdrawnReason() ==
    "The Beacon Registry Team deleted the record with reason: 'Incorrectly registered'";
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

  private LegacyData getLegacyBeaconData() throws Exception {
    ObjectMapper objectMapper = new ObjectMapper();

    return objectMapper.readValue(
      fixtureHelper.getFixture(
        "src/test/resources/fixtures/legacyBeaconData.json"
      ),
      LegacyData.class
    );
  }
}
