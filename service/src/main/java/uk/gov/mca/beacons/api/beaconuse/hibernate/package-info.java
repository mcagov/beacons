@TypeDef(defaultForType = BeaconUseId.class, typeClass = BeaconUseIdType.class)
@GenericGenerator(
  name = BeaconUse.ID_GENERATOR_NAME,
  strategy = BeaconUseIdGenerator.STRATEGY
)
package uk.gov.mca.beacons.api.beaconuse.hibernate;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.TypeDef;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUseId;
