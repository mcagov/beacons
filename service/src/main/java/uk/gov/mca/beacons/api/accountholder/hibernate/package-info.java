@TypeDef(
  defaultForType = AccountHolderId.class,
  typeClass = AccountHolderIdType.class
)
@GenericGenerator(
  name = AccountHolder.ID_GENERATOR_NAME,
  strategy = AccountHolderIdGenerator.STRATEGY
)
package uk.gov.mca.beacons.api.accountholder.hibernate;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.TypeDef;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderId;
