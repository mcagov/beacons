package uk.gov.mca.beacons.api.beacon.domain;

import java.util.Optional;
import java.util.UUID;
import javax.validation.constraints.NotNull;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import uk.gov.mca.beacons.api.BaseIntegrationTest;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderId;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderRepository;
import uk.gov.mca.beacons.api.beacon.application.BeaconService;

public class BeaconIntegrationTest extends BaseIntegrationTest {

  @Autowired
  AccountHolderRepository accountHolderRepository;

  @Autowired
  BeaconRepository beaconRepository;

  @Autowired
  BeaconService beaconService;

  @Test
  public void shouldSaveBeacon() {
    // setup
    AccountHolderId accountHolderId = createAccountHolder();

    Beacon beacon = generateBeacon();
    beacon.setAccountHolderId(accountHolderId);

    // act
    Beacon savedBeacon = beaconRepository.save(beacon);

    //assert
    assert savedBeacon.getId() != null;
    assert savedBeacon.getCreatedDate() != null;
    assert savedBeacon.getLastModifiedDate() != null;
  }

  @Test
  public void shouldUpdateBeaconStatusToChange() {
    // setup
    AccountHolderId accountHolderId = createAccountHolder();

    Beacon beacon = generateBeacon();
    beacon.setAccountHolderId(accountHolderId);

    // act
    Beacon savedBeacon = beaconRepository.save(beacon);
    assert savedBeacon.getBeaconStatus() == BeaconStatus.NEW;
    savedBeacon.setModel("Different");
    beaconService.update(savedBeacon.getId(), savedBeacon);
    Beacon retrievedBeacon = beaconService
      .findById(savedBeacon.getId())
      .orElse(null);
    //assert
    assert retrievedBeacon != null;
    assert retrievedBeacon.getBeaconStatus() == BeaconStatus.CHANGE;
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

  @NotNull
  private static Beacon generateBeacon() {
    Beacon beacon = new Beacon();
    beacon.setBeaconType("SSAS");
    beacon.setBeaconStatus(BeaconStatus.NEW);
    beacon.setHexId("1D1234123412345");
    beacon.setManufacturer("Test Manufacturer");
    beacon.setModel("Test model");
    beacon.setManufacturerSerialNumber("Test serial number");
    return beacon;
  }
}
