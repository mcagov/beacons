package uk.gov.mca.beacons.api.legacybeacon.application;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.List;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import uk.gov.mca.beacons.api.legacybeacon.LegacyBeaconTestUtils;
import uk.gov.mca.beacons.api.legacybeacon.domain.*;
import uk.gov.mca.beacons.api.utils.BeaconsStringUtils;

public class LegacyBeaconServiceUnitTest {

  @Mock
  LegacyBeaconRepository mockLegacyBeaconRepository = mock(
    LegacyBeaconRepository.class
  );

  LegacyBeaconService legacyBeaconService = new LegacyBeaconService(
    mockLegacyBeaconRepository
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

  @Test
  void delete_shouldRemoveAllTheSecondaryOwnersPersonallyIdentifiableInformation()
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
    List<LegacySecondaryOwner> secondaryOwners = legacyBeacon
      .getData()
      .getSecondaryOwners();

    assert deletedLegacyBeacons.size() == 1;
    assert secondaryOwners.isEmpty();
  }

  @Test
  void delete_shouldRemoveTheEmergencyContactsPersonallyIdentifiableInformation()
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
    LegacyEmergencyContact emergencyContact = legacyBeacon
      .getData()
      .getEmergencyContact();

    assert deletedLegacyBeacons.size() == 1;
    assert emergencyContact.getDetails() == null;
  }

  @Test
  void delete_shouldUpdateTheRootLevelLegacyBeaconLastModifiedDateToTodaysDate()
    throws Exception {
    final String hexId = "9D0E1D1B8C00001";
    final String email = "ownerbeacon@beacons.com";
    final LocalDate todaysDate = LocalDate.now();

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
      "The Beacon Registry Team deleted the record with reason: 'GDPR request'"
    );

    LegacyBeacon deletedLegacyBeacon = deletedLegacyBeacons.get(0);
    LocalDate lastModifiedDate = LocalDate.from(
      deletedLegacyBeacon.getLastModifiedDate()
    );

    Assertions.assertEquals(todaysDate, lastModifiedDate);
  }

  @Test
  void delete_shouldUpdateTheNestedBeaconJsonObjectsLastModifiedDateToTodaysDate()
    throws Exception {
    final String hexId = "9D0E1D1B8C00001";
    final String email = "ownerbeacon@beacons.com";
    final DateTimeFormatter dateFormatter = DateTimeFormatter.ofLocalizedDate(
      FormatStyle.SHORT
    );
    final String todaysDate = dateFormatter.format(LocalDate.now());

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
      "The Beacon Registry Team deleted the record with reason: 'GDPR request'"
    );

    LegacyBeacon deletedLegacyBeacon = deletedLegacyBeacons.get(0);
    LegacyBeaconDetails nestedBeaconDetails = deletedLegacyBeacon
      .getData()
      .getBeacon();
    String lastModifiedDate = BeaconsStringUtils.formatDate(
      nestedBeaconDetails.getLastModifiedDate(),
      dateFormatter
    );

    Assertions.assertEquals(todaysDate, lastModifiedDate);
  }
}
