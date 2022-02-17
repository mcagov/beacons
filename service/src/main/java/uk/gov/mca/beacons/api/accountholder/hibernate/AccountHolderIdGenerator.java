package uk.gov.mca.beacons.api.accountholder.hibernate;

import java.io.Serializable;
import java.util.UUID;
import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderId;

public class AccountHolderIdGenerator implements IdentifierGenerator {

  public static final String STRATEGY =
    "uk.gov.mca.beacons.api.accountholder.hibernate.AccountHolderIdGenerator";

  @Override
  public Serializable generate(
    SharedSessionContractImplementor session,
    Object object
  ) throws HibernateException {
    return new AccountHolderId(UUID.randomUUID());
  }
}
