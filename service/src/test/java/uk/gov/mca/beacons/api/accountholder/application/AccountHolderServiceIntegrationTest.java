package uk.gov.mca.beacons.api.accountholder.application;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.core.Is.is;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.microsoft.graph.http.GraphServiceException;
import com.microsoft.graph.models.PasswordProfile;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;
import org.jetbrains.annotations.NotNull;
import org.junit.Assert;
import org.junit.jupiter.api.*;
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
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.beacon.domain.BeaconRepository;
import uk.gov.mca.beacons.api.beacon.domain.BeaconStatus;
import uk.gov.mca.beacons.api.note.application.NoteService;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestExecutionListeners(
  value = { ApplicationEventsTestExecutionListener.class },
  mergeMode = TestExecutionListeners.MergeMode.MERGE_WITH_DEFAULTS
)
@RecordApplicationEvents
@Transactional
public class AccountHolderServiceIntegrationTest extends BaseIntegrationTest {

  @Autowired
  @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
  private ApplicationEvents events;

  @Autowired
  private AccountHolderService accountHolderService;

  @Autowired
  private NoteService noteService;

  @Autowired
  private BeaconRepository beaconRepository;

  @Autowired
  private MicrosoftGraphService graphService;

  private AzureAdAccountHolder createdAzAdUser;

  @BeforeEach
  public void setUpAzureAdUser() {
    PasswordProfile passwordProfile = new PasswordProfile();
    passwordProfile.password = UUID.randomUUID().toString();
    AzureAdAccountHolder azAdUser = AzureAdAccountHolder
      .builder()
      .email(UUID.randomUUID() + "@mt-test.com")
      .displayName("Wrong Name")
      .mailNickname("WrongN")
      .userPrincipalName("Wrong.Name@testmcga.onmicrosoft.com")
      .passwordProfile(passwordProfile)
      .build();

    createdAzAdUser =
      (AzureAdAccountHolder) graphService.createAzureAdUser(azAdUser);
  }

  @AfterEach
  public void tearDownAzureAdUser() {
    if (createdAzAdUser != null) {
      graphService.deleteUser(createdAzAdUser.getUserId().toString());
    }
  }

  @Test
  public void whenCreatingAccountHolder_ShouldPublishEvent() {
    AccountHolder accountHolder = new AccountHolder();

    accountHolder.setAuthId(UUID.randomUUID().toString());
    accountHolder.setEmail(UUID.randomUUID() + "@mt-test.com");

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
  public void whenUpdatingAccountHolder_ShouldPublishEvent() throws Exception {
    AccountHolder accountHolder = new AccountHolder();
    accountHolder.setAuthId(UUID.randomUUID().toString());
    accountHolder.setEmail("test@test.com");
    accountHolder.setFullName("Wrong Name");
    accountHolder.setAuthId(createdAzAdUser.getUserId().toString());

    AccountHolderId id = accountHolderService.create(accountHolder).getId();

    AccountHolder accountHolderUpdate = new AccountHolder();
    accountHolderUpdate.setFullName("Integration Test User");
    accountHolderUpdate.setAuthId(createdAzAdUser.getUserId().toString());

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
  public void whenDeletingAccountHolderWithoutBeacons_ShouldSucceed()
    throws Exception {
    AccountHolder accountHolder = new AccountHolder();
    accountHolder.setAuthId(createdAzAdUser.getUserId().toString());
    accountHolder.setEmail(UUID.randomUUID() + "@mt-test.com");
    accountHolder.setFullName("Test Holder 2");
    AccountHolderId id = accountHolderService.create(accountHolder).getId();

    var adUser = graphService.getUser(accountHolder.getAuthId().toString());
    Assert.assertNotNull(adUser);

    accountHolderService.deleteAccountHolder(id);

    assertFalse(accountHolderService.getAccountHolder(id).isPresent());

    assertThrows(
      GraphServiceException.class,
      () -> graphService.getUser(accountHolder.getAuthId().toString())
    );

    createdAzAdUser = null;
  }

  @Test
  public void whenDeletingAccountHolderWithBeacons_ShouldThrowException()
    throws Exception {
    AccountHolder accountHolder = new AccountHolder();
    accountHolder.setAuthId(createdAzAdUser.getUserId().toString());
    accountHolder.setEmail(UUID.randomUUID() + "@mt-test.com");
    accountHolder.setFullName("Test Holder");
    AccountHolderId id = accountHolderService.create(accountHolder).getId();

    var adUser = graphService.getUser(accountHolder.getAuthId().toString());
    Assert.assertNotNull(adUser);

    Beacon beacon = generateBeacon();
    beacon.setAccountHolderId(id);

    beaconRepository.save(beacon);

    assertFalse(
      accountHolderService
        .getBeaconsByAccountHolderId(accountHolder.getId())
        .isEmpty()
    );

    assertThrows(
      IllegalStateException.class,
      () -> accountHolderService.deleteAccountHolder(id)
    );

    var retainedAdUser = graphService.getUser(
      accountHolder.getAuthId().toString()
    );
    Assert.assertNotNull(retainedAdUser);
  }

  @Test
  public void whenTransferringABeaconToANewAccountHolder_ShouldSucceed()
    throws Exception {
    AccountHolder accountHolder = generateAccountHolder(UUID.randomUUID());
    AccountHolderId id = accountHolderService.create(accountHolder).getId();

    AccountHolder accountHolder2 = generateAccountHolder(UUID.randomUUID());
    AccountHolderId id2 = accountHolderService.create(accountHolder2).getId();

    Beacon beacon = generateBeacon();
    beacon.setAccountHolderId(id);

    beaconRepository.save(beacon);

    List<BeaconId> beaconsToTransfer = new ArrayList<>();
    beaconsToTransfer.add(beacon.getId());

    accountHolderService.transferBeacons(id2, beaconsToTransfer);

    assertFalse(
      accountHolderService
        .getBeaconsByAccountHolderId(accountHolder2.getId())
        .isEmpty()
    );
  }

  @Test
  public void whenTransferringMultipleBeaconsToANewAccountHolder_ShouldSucceed()
    throws Exception {
    AccountHolder accountHolder = generateAccountHolder(UUID.randomUUID());
    AccountHolderId id = accountHolderService.create(accountHolder).getId();

    AccountHolder accountHolder2 = generateAccountHolder(UUID.randomUUID());
    AccountHolderId id2 = accountHolderService.create(accountHolder2).getId();

    Beacon beacon = generateBeacon();
    beacon.setAccountHolderId(id);
    Beacon beaconTwo = generateBeacon();

    beaconTwo.setAccountHolderId(id);
    Beacon beaconThree = generateBeacon();

    beaconThree.setAccountHolderId(id);
    beaconRepository.save(beacon);

    beaconRepository.save(beaconTwo);
    beaconRepository.save(beaconThree);
    List<BeaconId> beaconsToTransfer = new ArrayList<>();

    beaconsToTransfer.add(beacon.getId());
    beaconsToTransfer.add(beaconTwo.getId());
    beaconsToTransfer.add(beaconThree.getId());
    accountHolderService.transferBeacons(id2, beaconsToTransfer);

    assertThat(
      accountHolderService
        .getBeaconsByAccountHolderId(accountHolder2.getId())
        .size(),
      equalTo(3)
    );
  }

  @Test
  public void whenTransferringBeaconsToANewAccountHolder_ShouldGenerateTransferNote()
    throws Exception {
    AccountHolder accountHolder = generateAccountHolder(UUID.randomUUID());
    AccountHolderId id = accountHolderService.create(accountHolder).getId();

    AccountHolder accountHolder2 = generateAccountHolder(UUID.randomUUID());
    AccountHolderId id2 = accountHolderService.create(accountHolder2).getId();

    Beacon beacon = generateBeacon();
    beacon.setAccountHolderId(id);

    beaconRepository.save(beacon);

    List<BeaconId> beaconsToTransfer = new ArrayList<>();
    beaconsToTransfer.add(beacon.getId());

    accountHolderService.transferBeacons(id2, beaconsToTransfer);

    assertThat(noteService.getByBeaconId(beacon.getId()).size(), equalTo(1));

    assertThat(
      noteService.getByBeaconId(beacon.getId()).get(0).getText(),
      containsString(accountHolder2.getFullName())
    );
    //assertion on note?
  }

  @Test
  public void whenTransferringAnUnknownBeacon_ShouldError() throws Exception {
    AccountHolder accountHolder2 = generateAccountHolder(UUID.randomUUID());
    AccountHolderId id2 = accountHolderService.create(accountHolder2).getId();

    List<BeaconId> beaconsToTransfer = new ArrayList<>();
    beaconsToTransfer.add(new BeaconId(UUID.randomUUID()));

    assertThrows(
      NoSuchElementException.class,
      () -> accountHolderService.transferBeacons(id2, beaconsToTransfer)
    );
  }

  @Test
  public void whenTransferringToAnUnknownAccountHolder_ShouldError()
    throws Exception {
    AccountHolder accountHolder = generateAccountHolder(UUID.randomUUID());
    AccountHolderId id = accountHolderService.create(accountHolder).getId();

    Beacon beacon = generateBeacon();
    beacon.setAccountHolderId(id);

    beaconRepository.save(beacon);

    List<BeaconId> beaconsToTransfer = new ArrayList<>();
    beaconsToTransfer.add(beacon.getId());

    assertThrows(
      NoSuchElementException.class,
      () ->
        accountHolderService.transferBeacons(
          new AccountHolderId(UUID.randomUUID()),
          beaconsToTransfer
        )
    );
  }

  @NotNull
  private static Beacon generateBeacon() {
    Beacon beacon = new Beacon();
    beacon.setHexId("testHexId");
    beacon.setManufacturer("testManufacturer");
    beacon.setModel("testModel");
    beacon.setManufacturerSerialNumber("testSerialNumber");
    beacon.setBeaconStatus(BeaconStatus.NEW);
    return beacon;
  }

  private static AccountHolder generateAccountHolder(UUID authId) {
    AccountHolder accountHolder = new AccountHolder();
    accountHolder.setAuthId(authId.toString());
    accountHolder.setEmail(authId + "@mt-test.com");
    accountHolder.setFullName("Test Holder");

    return accountHolder;
  }
}
