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
    LegacyBeacon legacyBeacon = LegacyBeaconTestUtils.initLegacyBeacon();

    when(mockLegacyBeaconRepository.save(legacyBeacon)).thenReturn(
      legacyBeacon
    );
    when(mockLegacyBeaconRepository.save(legacyBeacon)).thenReturn(
      legacyBeacon
    );

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

    when(mockLegacyBeaconRepository.save(legacyBeacon)).thenReturn(
      legacyBeacon
    );
    when(mockLegacyBeaconRepository.save(legacyBeacon)).thenReturn(
      legacyBeacon
    );

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

    when(mockLegacyBeaconRepository.save(legacyBeacon)).thenReturn(
      legacyBeacon
    );
    when(mockLegacyBeaconRepository.save(legacyBeacon)).thenReturn(
      legacyBeacon
    );

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

    when(mockLegacyBeaconRepository.save(legacyBeacon)).thenReturn(
      legacyBeacon
    );
    when(mockLegacyBeaconRepository.save(legacyBeacon)).thenReturn(
      legacyBeacon
    );

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

    when(mockLegacyBeaconRepository.save(legacyBeacon)).thenReturn(
      legacyBeacon
    );
    when(mockLegacyBeaconRepository.save(legacyBeacon)).thenReturn(
      legacyBeacon
    );

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

    when(mockLegacyBeaconRepository.save(legacyBeacon)).thenReturn(
      legacyBeacon
    );
    when(mockLegacyBeaconRepository.save(legacyBeacon)).thenReturn(
      legacyBeacon
    );

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

    when(mockLegacyBeaconRepository.save(legacyBeacon)).thenReturn(
      legacyBeacon
    );
    when(mockLegacyBeaconRepository.save(legacyBeacon)).thenReturn(
      legacyBeacon
    );

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

  @Test
  void findByHexIdAndAccountHolderEmail_whenOwnerEmailMatchesTheAccountHolderEmail_shouldReturnAListOfOneLegacyBeaconWithAnOwnerEmailMatchingAccountHolderEmail()
    throws Exception {
    String accountHolderEmail = "gracinoir@gmail.com";
    LegacyBeacon legacyBeacon = LegacyBeaconTestUtils.initLegacyBeacon();
    legacyBeacon.setOwnerEmail("gracinoir@gmail.com");
    legacyBeacon.setRecoveryEmail("barry@hotmail.com");

    when(
      mockLegacyBeaconRepository.findByHexId(legacyBeacon.getHexId())
    ).thenReturn(List.of(legacyBeacon));

    List<LegacyBeacon> beaconsWhereAccountHolderEmailAndOwnerEmailMatch =
      legacyBeaconService.findByHexIdAndAccountHolderEmail(
        legacyBeacon.getHexId(),
        accountHolderEmail
      );

    Assertions.assertEquals(
      1,
      beaconsWhereAccountHolderEmailAndOwnerEmailMatch.size()
    );
  }

  @Test
  void findByHexIdAndAccountHolderEmail_whenRecoveryEmailMatchesTheAccountHolderEmail_shouldReturnAListOfOneLegacyBeaconWithARecoveryEmailMatchingAccountHolderEmail()
    throws Exception {
    String accountHolderEmail = "cooldude@gmail.com";
    LegacyBeacon legacyBeacon = LegacyBeaconTestUtils.initLegacyBeacon();
    legacyBeacon.setOwnerEmail("barry@gmail.com");
    legacyBeacon.setRecoveryEmail("cooldude@gmail.com");

    when(
      mockLegacyBeaconRepository.findByHexId(legacyBeacon.getHexId())
    ).thenReturn(List.of(legacyBeacon));

    List<LegacyBeacon> beaconsWhereAccountHolderEmailAndRecoveryEmailMatch =
      legacyBeaconService.findByHexIdAndAccountHolderEmail(
        legacyBeacon.getHexId(),
        accountHolderEmail
      );

    Assertions.assertEquals(
      1,
      beaconsWhereAccountHolderEmailAndRecoveryEmailMatch.size()
    );
  }

  @Test
  void findByHexIdAndAccountHolderEmail_whenOwnerEmailMatchesTheAccountHolderEmailCaseInsensitive_shouldReturnAListOfOneLegacyBeaconWithAnOwnerEmailMatchingAccountHolderEmail()
    throws Exception {
    String accountHolderEmail = "Sam.Kendell@madetech.com";
    LegacyBeacon legacyBeacon = LegacyBeaconTestUtils.initLegacyBeacon();
    legacyBeacon.setOwnerEmail("sam.kendell@MadeTech.com");
    legacyBeacon.setRecoveryEmail("barry@hotmail.com");

    when(
      mockLegacyBeaconRepository.findByHexId(legacyBeacon.getHexId())
    ).thenReturn(List.of(legacyBeacon));

    List<LegacyBeacon> beaconsWhereAccountHolderEmailAndOwnerEmailMatch =
      legacyBeaconService.findByHexIdAndAccountHolderEmail(
        legacyBeacon.getHexId(),
        accountHolderEmail
      );

    Assertions.assertEquals(
      1,
      beaconsWhereAccountHolderEmailAndOwnerEmailMatch.size()
    );
  }

  @Test
  void findByHexIdAndAccountHolderEmail_whenRecoveryEmailMatchesTheAccountHolderEmailCaseInsensitive_shouldReturnAListOfOneLegacyBeaconWithARecoveryEmailMatchingAccountHolderEmail()
    throws Exception {
    String accountHolderEmail = "Sam.Kendell@madetech.com";
    LegacyBeacon legacyBeacon = LegacyBeaconTestUtils.initLegacyBeacon();
    legacyBeacon.setOwnerEmail("barry@gmail.com");
    legacyBeacon.setRecoveryEmail("sam.kendell@MadeTech.com");

    when(
      mockLegacyBeaconRepository.findByHexId(legacyBeacon.getHexId())
    ).thenReturn(List.of(legacyBeacon));

    List<LegacyBeacon> beaconsWhereAccountHolderEmailAndRecoveryEmailMatch =
      legacyBeaconService.findByHexIdAndAccountHolderEmail(
        legacyBeacon.getHexId(),
        accountHolderEmail
      );

    Assertions.assertEquals(
      1,
      beaconsWhereAccountHolderEmailAndRecoveryEmailMatch.size()
    );
  }

  @Test
  void findByHexIdAndAccountHolderEmail_whenOwnerEmailIsNullButThereIsARecoveryEmail_shouldReturnAListOfOneLegacyBeaconWithARecoveryEmailMatchingAccountHolderEmail()
    throws Exception {
    String accountHolderEmail = "cooldude@gmail.com";
    LegacyBeacon legacyBeacon = LegacyBeaconTestUtils.initLegacyBeacon();
    legacyBeacon.setOwnerEmail(null);
    legacyBeacon.setRecoveryEmail("cooldude@gmail.com");

    when(
      mockLegacyBeaconRepository.findByHexId(legacyBeacon.getHexId())
    ).thenReturn(List.of(legacyBeacon));

    List<LegacyBeacon> beaconsWhereAccountHolderEmailAndRecoveryEmailMatch =
      legacyBeaconService.findByHexIdAndAccountHolderEmail(
        legacyBeacon.getHexId(),
        accountHolderEmail
      );

    Assertions.assertEquals(
      1,
      beaconsWhereAccountHolderEmailAndRecoveryEmailMatch.size()
    );
  }

  @Test
  void findByHexIdAndAccountHolderEmail_whenNeitherEmailMatchesAccountHolderEmail_shouldReturnAnEmptyList()
    throws Exception {
    String accountHolderEmail = "gracinoir@gmail.com";
    LegacyBeacon legacyBeacon = LegacyBeaconTestUtils.initLegacyBeacon();
    legacyBeacon.setOwnerEmail("barry@gmail.com");
    legacyBeacon.setRecoveryEmail("cooldude@gmail.com");

    List<LegacyBeacon> beaconsWithNoMatchOnEitherEmailAddress =
      legacyBeaconService.findByHexIdAndAccountHolderEmail(
        legacyBeacon.getHexId(),
        accountHolderEmail
      );

    Assertions.assertEquals(0, beaconsWithNoMatchOnEitherEmailAddress.size());
  }

  @Test
  void findByHexIdAndAccountHolderEmail_whenTheAccountHolderEmailIsNull_shouldReturnAnEmptyList()
    throws Exception {
    String accountHolderEmail = null;
    LegacyBeacon legacyBeacon = LegacyBeaconTestUtils.initLegacyBeacon();
    legacyBeacon.setOwnerEmail("barry@gmail.com");
    legacyBeacon.setRecoveryEmail("cooldude@gmail.com");

    List<LegacyBeacon> beaconsWithNoMatch =
      legacyBeaconService.findByHexIdAndAccountHolderEmail(
        legacyBeacon.getHexId(),
        accountHolderEmail
      );

    Assertions.assertEquals(0, beaconsWithNoMatch.size());
  }

  @Test
  void findByHexIdAndAccountHolderEmail_whenRecoveryEmailIsNullAndOwnerEmailDoesNotMatchTheAccountHolderEmail_shouldReturnAnEmptyList()
    throws Exception {
    String accountHolderEmail = "cooldude@gmail.com";
    LegacyBeacon legacyBeacon = LegacyBeaconTestUtils.initLegacyBeacon();
    legacyBeacon.setOwnerEmail("charliep@hotmail.com");
    legacyBeacon.setRecoveryEmail(null);

    List<LegacyBeacon> beaconsWithNoOwnerEmailMatchAndNoRecoveryEmail =
      legacyBeaconService.findByHexIdAndAccountHolderEmail(
        legacyBeacon.getHexId(),
        accountHolderEmail
      );

    Assertions.assertEquals(
      0,
      beaconsWithNoOwnerEmailMatchAndNoRecoveryEmail.size()
    );
  }

  @Test
  void findByHexIdAndAccountHolderEmail_whenBothRecoveryEmailAndOwnerEmailAreNull_shouldReturnAnEmptyList()
    throws Exception {
    String accountHolderEmail = "cooldude@gmail.com";
    LegacyBeacon legacyBeacon = LegacyBeaconTestUtils.initLegacyBeacon();
    legacyBeacon.setOwnerEmail(null);
    legacyBeacon.setRecoveryEmail(null);

    List<LegacyBeacon> beaconsWithNoOwnerEmailAndNoRecoveryEmail =
      legacyBeaconService.findByHexIdAndAccountHolderEmail(
        legacyBeacon.getHexId(),
        accountHolderEmail
      );

    Assertions.assertEquals(
      0,
      beaconsWithNoOwnerEmailAndNoRecoveryEmail.size()
    );
  }

  @Test
  void sanitiseRecoveryEmail_whenTheRecoveryEmailContainsJavaScript_shouldRemoveJavaScript() {
    String recoveryEmail = "<script><alert>Hello!</alert></script>";

    String sanitisedEmail = legacyBeaconService.sanitiseRecoveryEmail(
      recoveryEmail
    );

    Assertions.assertEquals("", sanitisedEmail);
  }

  @Test
  void sanitiseRecoveryEmail_whenTheRecoveryEmailContainsAlertTags_shouldRemoveTheAlertTags() {
    String recoveryEmail = "<alert>Hello!</alert>";

    String sanitisedEmail = legacyBeaconService.sanitiseRecoveryEmail(
      recoveryEmail
    );

    Assertions.assertEquals("", sanitisedEmail);
  }

  @Test
  void sanitiseRecoveryEmail_whenTheRecoveryEmailContainsHtmlTags_shouldRemoveHtmlTags() {
    String recoveryEmail = "furry<h1>chicken</h1>@gmail.com";

    String sanitisedEmail = legacyBeaconService.sanitiseRecoveryEmail(
      recoveryEmail
    );

    Assertions.assertEquals("furry@gmail.com", sanitisedEmail);
  }

  @Test
  void sanitiseRecoveryEmail_whenTheRecoveryEmailContainsCurlyBraces_shouldRemoveCurlyBraces() {
    String recoveryEmail = "{const cheese = 'cheddar';}";

    String sanitisedEmail = legacyBeaconService.sanitiseRecoveryEmail(
      recoveryEmail
    );

    Assertions.assertEquals("const cheese = 'cheddar';", sanitisedEmail);
  }

  @Test
  void sanitiseRecoveryEmail_whenTheRecoveryEmailContainsADollarSign_shouldRemoveDollarSign() {
    String recoveryEmail = "barry$attack@gmail.com";

    String sanitisedEmail = legacyBeaconService.sanitiseRecoveryEmail(
      recoveryEmail
    );

    Assertions.assertEquals("barryattack@gmail.com", sanitisedEmail);
  }

  @Test
  void sanitiseRecoveryEmail_whenTheRecoveryEmailContainsAnAmpersand_shouldRemoveAmpersand() {
    String recoveryEmail = "hey&@hotmail.com";

    String sanitisedEmail = legacyBeaconService.sanitiseRecoveryEmail(
      recoveryEmail
    );

    Assertions.assertEquals("hey@hotmail.com", sanitisedEmail);
  }

  @Test
  void sanitiseRecoveryEmail_whenTheRecoveryEmailIsValid_shouldNotRemoveAnything() {
    String recoveryEmail = "eviesandsam@hotmail.com";

    String sanitisedEmail = legacyBeaconService.sanitiseRecoveryEmail(
      recoveryEmail
    );

    Assertions.assertEquals("eviesandsam@hotmail.com", sanitisedEmail);
  }
}
