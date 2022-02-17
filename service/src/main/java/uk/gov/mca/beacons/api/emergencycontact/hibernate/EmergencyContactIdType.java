package uk.gov.mca.beacons.api.emergencycontact.hibernate;

import uk.gov.mca.beacons.api.emergencycontact.domain.EmergencyContactId;
import uk.gov.mca.beacons.api.shared.hibernate.DomainObjectIdCustomType;
import uk.gov.mca.beacons.api.shared.hibernate.DomainObjectIdTypeDescriptor;

public class EmergencyContactIdType
  extends DomainObjectIdCustomType<EmergencyContactId> {

  private static final DomainObjectIdTypeDescriptor<EmergencyContactId> TYPE_DESCRIPTOR = new DomainObjectIdTypeDescriptor<>(
    EmergencyContactId.class,
    EmergencyContactId::new
  );

  public EmergencyContactIdType() {
    super(TYPE_DESCRIPTOR);
  }
}
