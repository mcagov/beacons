package uk.gov.mca.beacons.api.legacybeacon.application;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalUnit;
import java.util.List;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import uk.gov.mca.beacons.api.FixtureHelper;
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
    LegacyBeacon legacyBeacon = LegacyBeaconTestUtils.initLegacyBeacon();

    when(mockLegacyBeaconRepository.save(legacyBeacon))
      .thenReturn(legacyBeacon);
    when(mockLegacyBeaconRepository.save(legacyBeacon))
      .thenReturn(legacyBeacon);

    legacyBeaconService.create(legacyBeacon);

    LegacyBeacon deletedLegacyBeacon = legacyBeaconService.delete(
      legacyBeacon,
      "The Beacon Registry Team deleted the record with reason: 'Duplicate'"
    );

    assert legacyBeacon.getBeaconStatus() == "DELETED";
  }

  @Test
  void delete_shouldMarkTheBeaconAsWithdrawnAndAddTheDeletionReasonAsAWithdrawnReason()
    throws Exception {
    LegacyBeacon legacyBeacon = LegacyBeaconTestUtils.initLegacyBeacon();

    when(mockLegacyBeaconRepository.save(legacyBeacon))
      .thenReturn(legacyBeacon);
    when(mockLegacyBeaconRepository.save(legacyBeacon))
      .thenReturn(legacyBeacon);

    legacyBeaconService.create(legacyBeacon);

    LegacyBeacon deletedLegacyBeacon = legacyBeaconService.delete(
      legacyBeacon,
      "The Beacon Registry Team deleted the record with reason: 'Incorrectly registered'"
    );

    LegacyBeaconDetails beaconDetails = legacyBeacon.getData().getBeacon();

    assert beaconDetails.getIsWithdrawn() == "Y";
    assert beaconDetails.getWithdrawnReason() ==
    "The Beacon Registry Team deleted the record with reason: 'Incorrectly registered'";
  }

  @Test
  void delete_shouldRemoveAllTheOwnersPersonallyIdentifiableInformation()
    throws Exception {
    LegacyBeacon legacyBeacon = LegacyBeaconTestUtils.initLegacyBeacon();

    when(mockLegacyBeaconRepository.save(legacyBeacon))
      .thenReturn(legacyBeacon);
    when(mockLegacyBeaconRepository.save(legacyBeacon))
      .thenReturn(legacyBeacon);

    legacyBeaconService.create(legacyBeacon);

    LegacyBeacon deletedLegacyBeacon = legacyBeaconService.delete(
      legacyBeacon,
      "The Beacon Registry Team deleted the record with reason: 'Destroyed'"
    );

    LegacyOwner ownerData = legacyBeacon.getData().getOwner();

    assert ownerData.getAddress1() == null;
    assert ownerData.getOwnerName() == null;
    assert ownerData.getEmail() == null;
  }

  @Test
  void delete_shouldRemoveAllTheSecondaryOwnersPersonallyIdentifiableInformation()
    throws Exception {
    LegacyBeacon legacyBeacon = LegacyBeaconTestUtils.initLegacyBeacon();

    when(mockLegacyBeaconRepository.save(legacyBeacon))
      .thenReturn(legacyBeacon);
    when(mockLegacyBeaconRepository.save(legacyBeacon))
      .thenReturn(legacyBeacon);

    legacyBeaconService.create(legacyBeacon);

    LegacyBeacon deletedLegacyBeacon = legacyBeaconService.delete(
      legacyBeacon,
      "The Beacon Registry Team deleted the record with reason: 'Incorrectly registered'"
    );

    List<LegacySecondaryOwner> secondaryOwners = legacyBeacon
      .getData()
      .getSecondaryOwners();

    assert secondaryOwners.isEmpty();
  }

  @Test
  void delete_shouldRemoveTheEmergencyContactsPersonallyIdentifiableInformation()
    throws Exception {
    LegacyBeacon legacyBeacon = LegacyBeaconTestUtils.initLegacyBeacon();

    when(mockLegacyBeaconRepository.save(legacyBeacon))
      .thenReturn(legacyBeacon);
    when(mockLegacyBeaconRepository.save(legacyBeacon))
      .thenReturn(legacyBeacon);

    legacyBeaconService.create(legacyBeacon);

    LegacyBeacon deletedLegacyBeacon = legacyBeaconService.delete(
      legacyBeacon,
      "The Beacon Registry Team deleted the record with reason: 'Incorrectly registered'"
    );

    LegacyEmergencyContact emergencyContact = legacyBeacon
      .getData()
      .getEmergencyContact();

    assert emergencyContact.getDetails() == null;
  }

  @Test
  void delete_shouldUpdateTheRootLevelLegacyBeaconLastModifiedDateToTodaysDate()
    throws Exception {
    final LocalDate todaysDate = LocalDate.now();

    LegacyBeacon legacyBeacon = LegacyBeaconTestUtils.initLegacyBeacon();

    when(mockLegacyBeaconRepository.save(legacyBeacon))
      .thenReturn(legacyBeacon);
    when(mockLegacyBeaconRepository.save(legacyBeacon))
      .thenReturn(legacyBeacon);

    legacyBeaconService.create(legacyBeacon);

    LegacyBeacon deletedLegacyBeacon = legacyBeaconService.delete(
      legacyBeacon,
      "The Beacon Registry Team deleted the record with reason: 'GDPR request'"
    );

    LocalDate lastModifiedDate = LocalDate.from(
      deletedLegacyBeacon.getLastModifiedDate()
    );

    Assertions.assertEquals(todaysDate, lastModifiedDate);
  }

  @Test
  void delete_shouldUpdateTheNestedBeaconJsonObjectsLastModifiedDateToTodaysDate()
    throws Exception {
    final DateTimeFormatter dateFormatter = DateTimeFormatter.ofLocalizedDate(
      FormatStyle.SHORT
    );
    final String todaysDate = dateFormatter.format(LocalDate.now());

    LegacyBeacon legacyBeacon = LegacyBeaconTestUtils.initLegacyBeacon();

    when(mockLegacyBeaconRepository.save(legacyBeacon))
      .thenReturn(legacyBeacon);
    when(mockLegacyBeaconRepository.save(legacyBeacon))
      .thenReturn(legacyBeacon);

    legacyBeaconService.create(legacyBeacon);

    LegacyBeacon deletedLegacyBeacon = legacyBeaconService.delete(
      legacyBeacon,
      "The Beacon Registry Team deleted the record with reason: 'GDPR request'"
    );

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
