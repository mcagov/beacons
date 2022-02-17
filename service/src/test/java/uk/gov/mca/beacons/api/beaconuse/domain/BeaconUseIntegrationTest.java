package uk.gov.mca.beacons.api.beaconuse.domain;

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

public class BeaconUseIntegrationTest extends BaseIntegrationTest {

  @Autowired
  AccountHolderRepository accountHolderRepository;

  @Autowired
  BeaconRepository beaconRepository;

  @Autowired
  BeaconUseRepository beaconUseRepository;

  @Test
  void shouldSaveBeaconUse() {
    // set up
    AccountHolderId accountHolderId = createAccountHolder();
    BeaconId beaconId = createBeacon(accountHolderId);

    BeaconUse beaconUse = new BeaconUse();
    beaconUse.setEnvironment(Environment.AVIATION);
    beaconUse.setActivity(Activity.CARGO_AIRPLANE);
    beaconUse.setPurpose(Purpose.COMMERCIAL);
    beaconUse.setMainUse(true);
    beaconUse.setBeaconId(beaconId);
    beaconUse.setMoreDetails("Not sure why this is mandatory :(");

    // act
    BeaconUse savedBeaconUse = beaconUseRepository.save(beaconUse);

    // assert
    assert savedBeaconUse.getId() != null;
    assert savedBeaconUse.getBeaconId().equals(beaconId);
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
