package uk.gov.mca.beacons.api.beaconowner.domain;

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
import uk.gov.mca.beacons.api.shared.domain.person.Address;

public class BeaconOwnerIntegrationTest extends BaseIntegrationTest {

  @Autowired
  AccountHolderRepository accountHolderRepository;

  @Autowired
  BeaconRepository beaconRepository;

  @Autowired
  BeaconOwnerRepository beaconOwnerRepository;

  @Test
  void shouldSaveBeaconOwner() {
    AccountHolderId accountHolderId = createAccountHolder();
    BeaconId beaconId = createBeacon(accountHolderId);

    BeaconOwner beaconOwner = new BeaconOwner();
    beaconOwner.setEmail("test@thetestssons.com");
    beaconOwner.setFullName("Test Testsson");
    beaconOwner.setTelephoneNumber("07825996445");
    beaconOwner.setAddress(
      Address
        .builder()
        .addressLine1("123 Test")
        .addressLine2("Testgatan")
        .townOrCity("Karlstad")
        .county("Värmland")
        .postcode("65223")
        .country("Sverige")
        .build()
    );
    beaconOwner.setBeaconId(beaconId);

    BeaconOwner savedBeaconOwner = beaconOwnerRepository.save(beaconOwner);

    assert savedBeaconOwner.getId() != null;
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
