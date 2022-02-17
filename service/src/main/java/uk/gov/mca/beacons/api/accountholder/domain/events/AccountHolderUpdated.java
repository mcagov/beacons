package uk.gov.mca.beacons.api.accountholder.domain.events;

import java.util.Objects;
import org.springframework.lang.NonNull;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderId;
import uk.gov.mca.beacons.api.shared.domain.base.DomainEvent;

public class AccountHolderUpdated implements DomainEvent {

  private final AccountHolder accountHolder;

  public AccountHolderUpdated(@NonNull AccountHolder accountHolder) {
    this.accountHolder = accountHolder;
  }

  @NonNull
  public AccountHolderId getAccountHolderId() {
    return Objects.requireNonNull(this.accountHolder.getId());
  }
}
