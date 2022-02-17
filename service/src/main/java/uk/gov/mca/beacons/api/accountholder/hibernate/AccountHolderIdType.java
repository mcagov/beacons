package uk.gov.mca.beacons.api.accountholder.hibernate;

import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderId;
import uk.gov.mca.beacons.api.shared.hibernate.DomainObjectIdCustomType;
import uk.gov.mca.beacons.api.shared.hibernate.DomainObjectIdTypeDescriptor;

public class AccountHolderIdType
  extends DomainObjectIdCustomType<AccountHolderId> {

  private static final DomainObjectIdTypeDescriptor<AccountHolderId> TYPE_DESCRIPTOR = new DomainObjectIdTypeDescriptor<>(
    AccountHolderId.class,
    AccountHolderId::new
  );

  public AccountHolderIdType() {
    super(TYPE_DESCRIPTOR);
  }
}
