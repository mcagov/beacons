@TypeDefs(
  {
    @TypeDef(
      defaultForType = LegacyBeaconId.class,
      typeClass = LegacyBeaconIdType.class
    ),
    @TypeDef(
      defaultForType = LegacyBeaconActionId.class,
      typeClass = LegacyBeaconActionIdType.class
    ),
  }
)
@GenericGenerators(
  {
    @GenericGenerator(
      name = LegacyBeacon.ID_GENERATOR_NAME,
      strategy = LegacyBeaconIdGenerator.STRATEGY
    ),
    @GenericGenerator(
      name = LegacyBeaconAction.ID_GENERATOR_NAME,
      strategy = LegacyBeaconActionIdGenerator.STRATEGY
    ),
  }
)
package uk.gov.mca.beacons.api.legacybeacon.hibernate;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.GenericGenerators;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.TypeDefs;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeaconAction;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeaconActionId;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeaconId;
