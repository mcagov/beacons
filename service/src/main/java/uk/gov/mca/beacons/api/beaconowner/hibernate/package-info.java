@TypeDef(
  defaultForType = BeaconOwnerId.class,
  typeClass = BeaconOwnerIdType.class
)
@GenericGenerator(
  name = BeaconOwner.ID_GENERATOR_NAME,
  strategy = BeaconOwnerIdGenerator.STRATEGY
)
package uk.gov.mca.beacons.api.beaconowner.hibernate;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.TypeDef;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwner;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwnerId;
