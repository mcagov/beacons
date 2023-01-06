package uk.gov.mca.beacons.api.beacon.application;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.data.auditing.AuditingHandler;
import uk.gov.mca.beacons.api.FixtureHelper;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.domain.BeaconRepository;
import uk.gov.mca.beacons.api.legacybeacon.LegacyBeaconTestUtils;
import uk.gov.mca.beacons.api.legacybeacon.domain.*;
import uk.gov.mca.beacons.api.mappers.ModelPatcherFactory;

// test the get beacons from specific created date logic
// do same for legacy beacons
public class BeaconServiceUnitTest {

  @Mock
  BeaconRepository mockBeaconRepository = mock(BeaconRepository.class);

  @Mock
  AuditingHandler mockAuditingHandler = mock(AuditingHandler.class);

  @Mock
  ModelPatcherFactory<Beacon> mockModelPatcherFactory = mock(
    ModelPatcherFactory.class
  );

  BeaconService beaconService = new BeaconService(
    mockAuditingHandler,
    mockBeaconRepository,
    mockModelPatcherFactory
  );

  @Test
  void delete_shouldMarkLegacyBeaconStatusAsDeleted() throws Exception {
    final String hexId = "9D0E1D1B8C00001";
    final String email = "ownerbeacon@beacons.com";
    LegacyBeacon legacyBeacon = LegacyBeaconTestUtils.initLegacyBeacon();

    when(mockLegacyBeaconRepository.save(legacyBeacon))
      .thenReturn(legacyBeacon);
    when(mockLegacyBeaconRepository.findByHexIdAndOwnerEmail(hexId, email))
      .thenReturn(List.of(legacyBeacon));
    when(mockLegacyBeaconRepository.saveAll(List.of(legacyBeacon)))
      .thenReturn(List.of(legacyBeacon));

    legacyBeaconService.create(legacyBeacon);

    List<LegacyBeacon> deletedLegacyBeacons = legacyBeaconService.delete(
      hexId,
      email,
      "The Beacon Registry Team deleted the record with reason: 'Duplicate'"
    );

    assert deletedLegacyBeacons.size() == 1;
    assert deletedLegacyBeacons.get(0).getBeaconStatus() == "DELETED";
  }

  @Test
  void delete_shouldMarkTheBeaconAsWithdrawnAndAddTheDeletionReasonAsAWithdrawnReason()
    throws Exception {
    final String hexId = "9D0E1D1B8C00001";
    final String email = "ownerbeacon@beacons.com";
    LegacyBeacon legacyBeacon = LegacyBeaconTestUtils.initLegacyBeacon();

    when(mockLegacyBeaconRepository.save(legacyBeacon))
      .thenReturn(legacyBeacon);
    when(mockLegacyBeaconRepository.findByHexIdAndOwnerEmail(hexId, email))
      .thenReturn(List.of(legacyBeacon));
    when(mockLegacyBeaconRepository.saveAll(List.of(legacyBeacon)))
      .thenReturn(List.of(legacyBeacon));

    legacyBeaconService.create(legacyBeacon);

    List<LegacyBeacon> deletedLegacyBeacons = legacyBeaconService.delete(
      hexId,
      email,
      "The Beacon Registry Team deleted the record with reason: 'Incorrectly registered'"
    );

    LegacyBeacon deletedLegacyBeacon = deletedLegacyBeacons.get(0);
    LegacyBeaconDetails beaconDetails = legacyBeacon.getData().getBeacon();

    assert deletedLegacyBeacons.size() == 1;
    assert beaconDetails.getIsWithdrawn() == "Y";
    assert beaconDetails.getWithdrawnReason() ==
    "The Beacon Registry Team deleted the record with reason: 'Incorrectly registered'";
  }

  @Test
  void delete_shouldRemoveAllTheOwnersPersonallyIdentifiableInformation()
    throws Exception {
    final String hexId = "9D0E1D1B8C00001";
    final String email = "ownerbeacon@beacons.com";
    LegacyBeacon legacyBeacon = LegacyBeaconTestUtils.initLegacyBeacon();

    when(mockLegacyBeaconRepository.save(legacyBeacon))
      .thenReturn(legacyBeacon);
    when(mockLegacyBeaconRepository.findByHexIdAndOwnerEmail(hexId, email))
      .thenReturn(List.of(legacyBeacon));
    when(mockLegacyBeaconRepository.saveAll(List.of(legacyBeacon)))
      .thenReturn(List.of(legacyBeacon));

    legacyBeaconService.create(legacyBeacon);

    List<LegacyBeacon> deletedLegacyBeacons = legacyBeaconService.delete(
      hexId,
      email,
      "The Beacon Registry Team deleted the record with reason: 'Destroyed'"
    );

    LegacyBeacon deletedLegacyBeacon = deletedLegacyBeacons.get(0);
    LegacyOwner ownerData = legacyBeacon.getData().getOwner();

    assert deletedLegacyBeacons.size() == 1;
    assert ownerData.getAddress1() == null;
    assert ownerData.getOwnerName() == null;
    assert ownerData.getEmail() == null;
  }
}
