package uk.gov.mca.beacons.api;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

import com.github.javafaker.Faker;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderId;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.beacon.domain.BeaconStatus;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwner;
import uk.gov.mca.beacons.api.beaconuse.domain.Activity;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.beaconuse.domain.Environment;
import uk.gov.mca.beacons.api.beaconuse.domain.Purpose;
import uk.gov.mca.beacons.api.emergencycontact.domain.EmergencyContact;
import uk.gov.mca.beacons.api.shared.domain.person.Address;

public class BeaconMocker {

  private static final Faker faker = new Faker();

  public static AccountHolder getAccountHolder() {
    AccountHolder accountHolder = mock(AccountHolder.class);
    given(accountHolder.getFullName()).willReturn((faker.name().fullName()));
    given(accountHolder.getAuthId()).willReturn((UUID.randomUUID().toString()));
    given(accountHolder.getTelephoneNumber())
      .willReturn((faker.phoneNumber().phoneNumber()));
    given(accountHolder.getEmail())
      .willReturn((faker.internet().emailAddress()));
    given(accountHolder.getAddress()).willReturn((fakeAddress()));

    return accountHolder;
  }

  public static Beacon getBeacon() {
    return getBeacon(getAccountHolder().getId());
  }

  public static Beacon getBeacon(AccountHolderId accountHolderId) {
    Beacon beacon = mock(Beacon.class);
    given(beacon.getId()).willReturn(new BeaconId(UUID.randomUUID()));
    given(beacon.getBeaconStatus()).willReturn(BeaconStatus.NEW);
    given(beacon.getAccountHolderId()).willReturn(accountHolderId);
    given(beacon.getHexId()).willReturn(faker.regexify("1D[A-F1-9]{13}"));
    given(beacon.getManufacturer()).willReturn(faker.gameOfThrones().house());
    given(beacon.getManufacturerSerialNumber())
      .willReturn(faker.bothify("#?#?#?#?#?#???##"));
    given(beacon.getModel()).willReturn(faker.gameOfThrones().dragon());
    given(beacon.getCoding()).willReturn(faker.ancient().primordial());
    given(beacon.getLastModifiedDate())
      .willReturn(
        OffsetDateTime.ofInstant(
          faker.date().past(30, TimeUnit.DAYS).toInstant(),
          ZoneId.of("Z")
        )
      );

    return beacon;
  }

  public static BeaconUse getMaritimeUse(BeaconId beaconId) {
    BeaconUse beaconUse = mock(BeaconUse.class);
    given(beaconUse.getBeaconId()).willReturn(beaconId);
    given(beaconUse.getMainUse()).willReturn(true);
    given(beaconUse.getEnvironment()).willReturn(Environment.MARITIME);
    given(beaconUse.getPurpose()).willReturn(Purpose.COMMERCIAL);
    given(beaconUse.getActivity()).willReturn(Activity.MERCHANT_VESSEL);
    given(beaconUse.getCallSign()).willReturn(faker.letterify("?????", true));
    given(beaconUse.getFixedVhfRadio()).willReturn(true);
    given(beaconUse.getFixedVhfRadioValue())
      .willReturn(faker.numerify("### ####"));
    given(beaconUse.getVesselName())
      .willReturn(faker.lordOfTheRings().character());
    given(beaconUse.getMoreDetails())
      .willReturn(faker.hitchhikersGuideToTheGalaxy().marvinQuote());

    return beaconUse;
  }

  public static BeaconOwner getBeaconOwner(BeaconId beaconId) {
    BeaconOwner beaconOwner = mock(BeaconOwner.class);
    given(beaconOwner.getBeaconId()).willReturn(beaconId);
    given(beaconOwner.getFullName()).willReturn(faker.name().fullName());
    given(beaconOwner.getTelephoneNumber())
      .willReturn(faker.phoneNumber().phoneNumber());
    given(beaconOwner.getEmail()).willReturn(faker.internet().emailAddress());
    given(beaconOwner.getAddress()).willReturn(fakeAddress());

    return beaconOwner;
  }

  public static EmergencyContact getEmergencyContact(BeaconId beaconId) {
    EmergencyContact emergencyContact = mock(EmergencyContact.class);
    given(emergencyContact.getBeaconId()).willReturn(beaconId);
    given(emergencyContact.getFullName()).willReturn(faker.name().fullName());
    given(emergencyContact.getTelephoneNumber())
      .willReturn(faker.phoneNumber().phoneNumber());

    return emergencyContact;
  }

  private static Address fakeAddress() {
    return Address
      .builder()
      .addressLine1(faker.address().streetAddressNumber())
      .addressLine2(faker.address().streetAddress())
      .townOrCity(faker.address().city())
      .country(faker.address().country())
      .postcode(faker.address().zipCode())
      .build();
  }
}
