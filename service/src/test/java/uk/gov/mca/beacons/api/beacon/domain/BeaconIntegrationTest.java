package uk.gov.mca.beacons.api.beacon.domain;

import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import uk.gov.mca.beacons.api.BaseIntegrationTest;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderId;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderRepository;

public class BeaconIntegrationTest extends BaseIntegrationTest {

  @Autowired
  AccountHolderRepository accountHolderRepository;

  @Autowired
  BeaconRepository beaconRepository;

  @Test
  public void shouldSaveBeacon() {
    // setup
    AccountHolderId accountHolderId = createAccountHolder();

    Beacon beacon = new Beacon();
    beacon.setBeaconType("SSAS");
    beacon.setBeaconStatus(BeaconStatus.NEW);
    beacon.setHexId("1D1234123412345");
    beacon.setManufacturer("Test Manufacturer");
    beacon.setModel("Test model");
    beacon.setManufacturerSerialNumber("Test serial number");
    beacon.setAccountHolderId(accountHolderId);

    // act
    Beacon savedBeacon = beaconRepository.save(beacon);

    //assert
    assert savedBeacon.getId() != null;
    assert savedBeacon.getCreatedDate() != null;
    assert savedBeacon.getLastModifiedDate() != null;
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
}
