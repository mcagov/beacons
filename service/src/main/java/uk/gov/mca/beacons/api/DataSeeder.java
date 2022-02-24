package uk.gov.mca.beacons.api;

import com.github.javafaker.Faker;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderId;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderRepository;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.beacon.domain.BeaconRepository;
import uk.gov.mca.beacons.api.beacon.domain.BeaconStatus;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwner;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwnerRepository;
import uk.gov.mca.beacons.api.beaconuse.domain.*;
import uk.gov.mca.beacons.api.emergencycontact.domain.EmergencyContact;
import uk.gov.mca.beacons.api.emergencycontact.domain.EmergencyContactRepository;
import uk.gov.mca.beacons.api.shared.domain.person.Address;

@Profile("seed")
@Slf4j
@Component
@Transactional
public class DataSeeder implements CommandLineRunner {

  private final AccountHolderRepository accountHolderRepository;
  private final BeaconRepository beaconRepository;
  private final BeaconOwnerRepository beaconOwnerRepository;
  private final BeaconUseRepository beaconUseRepository;
  private final EmergencyContactRepository emergencyContactRepository;
  private final Faker faker = new Faker();

  @Autowired
  public DataSeeder(
    AccountHolderRepository accountHolderRepository,
    BeaconRepository beaconRepository,
    BeaconOwnerRepository beaconOwnerRepository,
    BeaconUseRepository beaconUseRepository,
    EmergencyContactRepository emergencyContactRepository
  ) {
    this.accountHolderRepository = accountHolderRepository;
    this.beaconRepository = beaconRepository;
    this.beaconOwnerRepository = beaconOwnerRepository;
    this.beaconUseRepository = beaconUseRepository;
    this.emergencyContactRepository = emergencyContactRepository;
  }

  @Override
  public void run(String... args) throws Exception {
    AccountHolder accountHolder = seedAccountHolder();
    long countBeaconRecords = beaconRepository.count();
    long desiredBeaconRecords = 1000;

    if (countBeaconRecords >= desiredBeaconRecords) {
      log.info(
        countBeaconRecords +
        " found, no need to seed.  I would have seeded if there were less than " +
        desiredBeaconRecords
      );
    } else {
      long numberRecordsToSeed = desiredBeaconRecords - countBeaconRecords;
      log.info("Seeding with " + numberRecordsToSeed + " test beacon records");

      for (long i = 0; i < numberRecordsToSeed; i++) {
        if (faker.random().nextInt(0, 10) == 1) {
          accountHolder = seedAccountHolder();
        }
        Beacon beacon = seedBeacon(accountHolder.getId());
        seedMaritimeUse(beacon.getId());
        seedBeaconOwner(beacon.getId());
        seedEmergencyContact(beacon.getId());
      }
    }
  }

  AccountHolder seedAccountHolder() {
    AccountHolder accountHolder = new AccountHolder();
    accountHolder.setFullName(faker.name().fullName());
    accountHolder.setAuthId(UUID.randomUUID().toString());
    accountHolder.setTelephoneNumber(faker.phoneNumber().phoneNumber());
    accountHolder.setEmail(faker.internet().emailAddress());
    accountHolder.setAddress(fakeAddress());

    return accountHolderRepository.save(accountHolder);
  }

  Beacon seedBeacon(AccountHolderId accountHolderId) {
    Beacon beacon = new Beacon();
    beacon.setBeaconStatus(BeaconStatus.NEW);
    beacon.setAccountHolderId(accountHolderId);
    beacon.setHexId(faker.regexify("1D[A-F1-9]{13}"));
    beacon.setManufacturer(faker.gameOfThrones().house());
    beacon.setManufacturerSerialNumber(faker.bothify("#?#?#?#?#?#???##"));
    beacon.setModel(faker.gameOfThrones().dragon());
    beacon.setCoding(faker.ancient().primordial());
    beacon.registerCreatedEvent();

    return beaconRepository.save(beacon);
  }

  BeaconUse seedMaritimeUse(BeaconId beaconId) {
    BeaconUse beaconUse = new BeaconUse();
    beaconUse.setBeaconId(beaconId);
    beaconUse.setMainUse(true);
    beaconUse.setEnvironment(Environment.MARITIME);
    beaconUse.setPurpose(Purpose.COMMERCIAL);
    beaconUse.setActivity(Activity.MERCHANT_VESSEL);
    beaconUse.setCallSign(faker.letterify("?????", true));
    beaconUse.setFixedVhfRadio(true);
    beaconUse.setFixedVhfRadioValue(faker.numerify("### ####"));
    beaconUse.setVesselName(faker.lordOfTheRings().character());
    beaconUse.setMoreDetails(faker.hitchhikersGuideToTheGalaxy().marvinQuote());

    return beaconUseRepository.save(beaconUse);
  }

  BeaconOwner seedBeaconOwner(BeaconId beaconId) {
    BeaconOwner beaconOwner = new BeaconOwner();
    beaconOwner.setBeaconId(beaconId);
    beaconOwner.setFullName(faker.name().fullName());
    beaconOwner.setTelephoneNumber(faker.phoneNumber().phoneNumber());
    beaconOwner.setEmail(faker.internet().emailAddress());
    beaconOwner.setAddress(fakeAddress());

    return beaconOwnerRepository.save(beaconOwner);
  }

  EmergencyContact seedEmergencyContact(BeaconId beaconId) {
    EmergencyContact emergencyContact = new EmergencyContact();
    emergencyContact.setBeaconId(beaconId);
    emergencyContact.setFullName(faker.name().fullName());
    emergencyContact.setTelephoneNumber(faker.phoneNumber().phoneNumber());

    return emergencyContactRepository.save(emergencyContact);
  }

  Address fakeAddress() {
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
