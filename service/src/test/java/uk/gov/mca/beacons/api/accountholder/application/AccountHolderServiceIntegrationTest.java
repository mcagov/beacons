package uk.gov.mca.beacons.api.accountholder.application;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.event.ApplicationEvents;
import org.springframework.test.context.event.ApplicationEventsTestExecutionListener;
import org.springframework.test.context.event.RecordApplicationEvents;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mca.beacons.api.BaseIntegrationTest;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderId;
import uk.gov.mca.beacons.api.accountholder.domain.events.AccountHolderCreated;
import uk.gov.mca.beacons.api.accountholder.domain.events.AccountHolderUpdated;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.domain.BeaconRepository;
import uk.gov.mca.beacons.api.beacon.domain.BeaconStatus;

@TestExecutionListeners(
  value = { ApplicationEventsTestExecutionListener.class },
  mergeMode = TestExecutionListeners.MergeMode.MERGE_WITH_DEFAULTS
)
@RecordApplicationEvents
@Transactional
public class AccountHolderServiceIntegrationTest extends BaseIntegrationTest {

  @Autowired
  @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
  ApplicationEvents events;

  @Autowired
  AccountHolderService accountHolderService;

  @Autowired
  BeaconRepository beaconRepository;

  @Test
  public void whenCreatingAccountHolder_ShouldPublishEvent() {
    AccountHolder accountHolder = new AccountHolder();

    accountHolder.setAuthId(UUID.randomUUID().toString());
    accountHolder.setEmail("test@test.com");

    AccountHolder createdAccountHolder = accountHolderService.create(
      accountHolder
    );
    List<AccountHolderCreated> accountHolderCreatedEvents = events
      .stream(AccountHolderCreated.class)
      .collect(Collectors.toList());

    assertThat(accountHolderCreatedEvents.size(), is(1));
    assertThat(
      accountHolderCreatedEvents.get(0).getAccountHolderId(),
      equalTo(createdAccountHolder.getId())
    );

    AccountHolder retrievedAccountHolder = accountHolderService
      .getAccountHolder(createdAccountHolder.getId())
      .orElse(null);

    assertThat(retrievedAccountHolder, equalTo(createdAccountHolder));
  }

  @Test
  public void whenUpdatingAccountHolder_ShouldPublishEvent() {
    AccountHolder accountHolder = new AccountHolder();
    accountHolder.setAuthId("test@test.com");
    accountHolder.setFullName("Wrong Name");
    AccountHolderId id = accountHolderService.create(accountHolder).getId();

    AccountHolder accountHolderUpdate = new AccountHolder();
    accountHolderUpdate.setFullName("Right Name");

    accountHolderService.updateAccountHolder(id, accountHolderUpdate);
    List<AccountHolderUpdated> accountHolderUpdatedEvents = events
      .stream(AccountHolderUpdated.class)
      .collect(Collectors.toList());

    assertThat(accountHolderUpdatedEvents.size(), is(1));
    assertThat(
      accountHolderUpdatedEvents.get(0).getAccountHolderId(),
      equalTo(id)
    );
    AccountHolder retrievedAccountHolder = accountHolderService
      .getAccountHolder(id)
      .orElse(null);

    assertThat(
      retrievedAccountHolder.getFullName(),
      equalTo(accountHolderUpdate.getFullName())
    );
  }

  @Test
  public void whenDeletingAccountHolderWithBeacons_ShouldThrowException() {
    AccountHolder accountHolder = new AccountHolder();
    accountHolder.setAuthId(UUID.randomUUID().toString());
    accountHolder.setEmail("test@test.com");
    accountHolder.setFullName("Test Holder");
    AccountHolderId id = accountHolderService.create(accountHolder).getId();

    Beacon beacon = new Beacon();
    beacon.setHexId("testHexId");
    beacon.setManufacturer("testManufacturer");
    beacon.setModel("testModel");
    beacon.setManufacturerSerialNumber("testSerialNumber");
    beacon.setBeaconStatus(BeaconStatus.NEW);
    beacon.setAccountHolderId(id);

    beaconRepository.save(beacon);

    assertThrows(
      IllegalStateException.class,
      () -> accountHolderService.deleteAccountHolder(id)
    );
  }

  @Test
  public void whenDeletingAccountHolderWithoutBeacons_ShouldSucceed() {
    AccountHolder accountHolder = new AccountHolder();
    accountHolder.setEmail("test@test.com");
    accountHolder.setFullName("Test Holder 2");
    AccountHolderId id = accountHolderService.create(accountHolder).getId();

    accountHolderService.deleteAccountHolder(id);

    assertFalse(accountHolderService.getAccountHolder(id).isPresent());
  }
}
