@TypeDef(defaultForType = BeaconId.class, typeClass = BeaconIdType.class)
@GenericGenerator(
  name = Beacon.ID_GENERATOR_NAME,
  strategy = BeaconIdGenerator.STRATEGY
)
package uk.gov.mca.beacons.api.beacon.hibernate;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.TypeDef;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
