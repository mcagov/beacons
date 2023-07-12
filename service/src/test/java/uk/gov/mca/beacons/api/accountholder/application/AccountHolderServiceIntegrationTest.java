package uk.gov.mca.beacons.api.accountholder.application;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.hamcrest.core.IsEqual.equalTo;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
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

  @InjectMocks
  @Autowired
  AccountHolderService accountHolderService;

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
    String testAuthId = "478879a5-03c7-42cd-a466-442ecf6dc2b7";

    accountHolder.setAuthId(testAuthId);
    accountHolder.setFullName("Wrong Name");
    AccountHolderId id = accountHolderService.create(accountHolder).getId();

    AccountHolder accountHolderUpdate = new AccountHolder();
    accountHolderUpdate.setAuthId(testAuthId);
    accountHolderUpdate.setFullName("Integration Test User");

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
