package uk.gov.mca.beacons.api.accountholder.application;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.hamcrest.core.IsEqual.equalTo;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.event.ApplicationEvents;
import org.springframework.test.context.event.ApplicationEventsTestExecutionListener;
import org.springframework.test.context.event.RecordApplicationEvents;
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
  }
}
