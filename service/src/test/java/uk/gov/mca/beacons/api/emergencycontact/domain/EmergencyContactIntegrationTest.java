package uk.gov.mca.beacons.api.emergencycontact.domain;

import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import uk.gov.mca.beacons.api.BaseIntegrationTest;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderId;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderRepository;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.beacon.domain.BeaconRepository;
import uk.gov.mca.beacons.api.beacon.domain.BeaconStatus;

public class EmergencyContactIntegrationTest extends BaseIntegrationTest {

  @Autowired
  AccountHolderRepository accountHolderRepository;

  @Autowired
  BeaconRepository beaconRepository;

  @Autowired
  EmergencyContactRepository emergencyContactRepository;

  @Test
  void shouldSaveEmergencyContact() {
    AccountHolderId accountHolderId = createAccountHolder();
    BeaconId beaconId = createBeacon(accountHolderId);
    EmergencyContact emergencyContact = new EmergencyContact();
    emergencyContact.setBeaconId(beaconId);
    emergencyContact.setFullName("Test Testsson");
    emergencyContact.setTelephoneNumber("07456789998");

    EmergencyContact savedEmergencyContact = emergencyContactRepository.save(
      emergencyContact
    );

    assert savedEmergencyContact.getId() != null;
    assert savedEmergencyContact.getFullName().equals("Test Testsson");
    assert savedEmergencyContact.getCreatedDate() != null;
  }

  private AccountHolderId createAccountHolder() {
    AccountHolder accountHolder = new AccountHolder();
    accountHolder.setAuthId(UUID.randomUUID().toString());
    accountHolder.setEmail("test@thetestssons.com");

    AccountHolder savedAccountHolder = accountHolderRepository.save(
      accountHolder
    );

    return savedAccountHolder.getId();
  }

  private BeaconId createBeacon(AccountHolderId accountHolderId) {
    Beacon beacon = new Beacon();
    beacon.setBeaconType("SSAS");
    beacon.setBeaconStatus(BeaconStatus.NEW);
    beacon.setHexId("1D1234123412345");
    beacon.setManufacturer("Test Manufacturer");
    beacon.setModel("Test model");
    beacon.setManufacturerSerialNumber("Test serial number");
    beacon.setAccountHolderId(accountHolderId);

    Beacon savedBeacon = beaconRepository.save(beacon);
    return savedBeacon.getId();
  }
}
