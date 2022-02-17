@TypeDef(
  defaultForType = EmergencyContactId.class,
  typeClass = EmergencyContactIdType.class
)
@GenericGenerator(
  name = EmergencyContact.ID_GENERATOR_NAME,
  strategy = EmergencyContactIdGenerator.STRATEGY
)
package uk.gov.mca.beacons.api.emergencycontact.hibernate;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.TypeDef;
import uk.gov.mca.beacons.api.emergencycontact.domain.EmergencyContact;
import uk.gov.mca.beacons.api.emergencycontact.domain.EmergencyContactId;
