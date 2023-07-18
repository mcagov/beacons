package uk.gov.mca.beacons.api.accountholder.application;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.hamcrest.core.IsEqual.equalTo;

import com.microsoft.graph.models.PasswordProfile;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.event.ApplicationEvents;
import org.springframework.test.context.event.ApplicationEventsTestExecutionListener;
import org.springframework.test.context.event.RecordApplicationEvents;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mca.beacons.api.BaseIntegrationTest;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderId;
import uk.gov.mca.beacons.api.accountholder.domain.events.AccountHolderCreated;
import uk.gov.mca.beacons.api.accountholder.domain.events.AccountHolderUpdated;

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
  ApplicationEvents events;

  @Autowired
  AccountHolderService accountHolderService;

  @Autowired
  @Qualifier("microsoftGraphClient")
  AuthClient microsoftGraphClient;

  AzureAdAccountHolder createdAzAdUser;

  @BeforeAll
  public void setUpAzureAdUser() {
    PasswordProfile passwordProfile = new PasswordProfile();
    passwordProfile.password = UUID.randomUUID().toString();

    AzureAdAccountHolder azAdUser = AzureAdAccountHolder
      .builder()
      .email("testuser@test.com")
      .displayName("Wrong Name")
      .mailNickname("WrongN")
      .userPrincipalName("Wrong.Name@testmcga.onmicrosoft.com")
      .passwordProfile(passwordProfile)
      .build();

    createdAzAdUser =
      (AzureAdAccountHolder) microsoftGraphClient.createAzureAdUser(azAdUser);
  }

  @AfterAll
  public void tearDownAzureAdUser() {
    microsoftGraphClient.deleteUser(createdAzAdUser.getUserId().toString());
  }

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
  }

  @Test
  public void whenUpdatingAccountHolder_ShouldPublishEvent() throws Exception {
    AccountHolder accountHolder = new AccountHolder();
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
  }
}
