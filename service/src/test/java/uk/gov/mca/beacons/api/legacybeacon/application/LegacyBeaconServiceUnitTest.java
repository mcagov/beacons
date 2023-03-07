package uk.gov.mca.beacons.api.legacybeacon.application;

import static java.util.stream.Collectors.groupingBy;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;
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

  @Test
  void findHexIdsWithDuplicates_shouldOnlyReturnHexIdsThatMatchMoreThanOneBeacon()
    throws Exception {
    // arrange
    LegacyBeacon legacyBeacon1 = LegacyBeaconTestUtils.initLegacyBeacon();
    LegacyBeacon legacyBeacon2 = LegacyBeaconTestUtils.initLegacyBeacon();

    legacyBeacon2.setHexId("666");

    LegacyBeacon legacyBeaconWithUniqueHexId = LegacyBeaconTestUtils.initLegacyBeacon();
    legacyBeaconWithUniqueHexId.setHexId("1D0EA08C52FFBFF");

    LegacyBeacon legacyBeaconWithOtherUniqueHexId = LegacyBeaconTestUtils.initLegacyBeacon();
    legacyBeaconWithOtherUniqueHexId.setHexId("1D0EA08C52FFBGG");

    List<LegacyBeacon> legacyBeaconsInRepo = new ArrayList<>();
    // 9D0E1D1B8C00001

    when(mockLegacyBeaconRepository.findByHexIdNotNull())
      .thenReturn(
        List.of(
          legacyBeacon1,
          legacyBeacon1,
          legacyBeacon1,
          legacyBeacon1,
          legacyBeacon1,
          legacyBeacon1,
          legacyBeacon1,
          legacyBeacon1,
          legacyBeacon1,
          legacyBeacon1,
          legacyBeacon1,
          legacyBeacon1,
          legacyBeacon2,
          legacyBeacon2,
          legacyBeaconWithUniqueHexId,
          legacyBeaconWithOtherUniqueHexId
        )
      );

    // act
    Map<String, Integer> duplicateHexIds = legacyBeaconService.findHexIdsWithDuplicates(
      20,
      0
    );
    int numberOfDuplicatesForFirstHexId = duplicateHexIds
      .values()
      .stream()
      .collect(Collectors.toList())
      .get(0);

    // assert
    Assertions.assertEquals(2, duplicateHexIds.size());
    Assertions.assertEquals(12, numberOfDuplicatesForFirstHexId);
  }
  //  public Map<String, Integer> findHexIdsWithDuplicates(
  //          int batchSize,
  //          int numberAlreadyTaken
  //  ) {
  //    Map<String, Integer> hexIdsAndDuplicateCounts = getBatchWhereHexIdIsNotNull(
  //            batchSize,
  //            numberAlreadyTaken
  //    )
  //            .stream()
  //            .collect(groupingBy(LegacyBeacon::getHexId, Collectors.counting()))
  //            .entrySet()
  //            .stream()
  //            .filter(m -> m.getValue() > 1)
  //            .collect(Collectors.toMap(m -> m.getKey(), m -> m.getValue().intValue()));
  //    return hexIdsAndDuplicateCounts;
  //  }

  //  public List<LegacyBeacon> getBatchWhereHexIdIsNotNull(
  //          int batchSize,
  //          int numberAlreadyTaken
  //  ) {
  //    Stream<LegacyBeacon> lbs = legacyBeaconRepository
  //            .findByHexIdNotNull()
  //            .stream();
  //
  //    List<LegacyBeacon> listLbs = lbs
  //            .skip(numberAlreadyTaken)
  //            .limit(batchSize)
  //            .collect(Collectors.toList());
  //
  //    return listLbs;
  //  }
}
