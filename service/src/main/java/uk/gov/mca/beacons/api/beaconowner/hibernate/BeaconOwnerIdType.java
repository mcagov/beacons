package uk.gov.mca.beacons.api.beaconowner.hibernate;

import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwnerId;
import uk.gov.mca.beacons.api.emergencycontact.domain.EmergencyContactId;
import uk.gov.mca.beacons.api.shared.hibernate.DomainObjectIdCustomType;
import uk.gov.mca.beacons.api.shared.hibernate.DomainObjectIdTypeDescriptor;

public class BeaconOwnerIdType extends DomainObjectIdCustomType<BeaconOwnerId> {

  private static final DomainObjectIdTypeDescriptor<BeaconOwnerId> TYPE_DESCRIPTOR = new DomainObjectIdTypeDescriptor<>(
    BeaconOwnerId.class,
    BeaconOwnerId::new
  );

  public BeaconOwnerIdType() {
    super(TYPE_DESCRIPTOR);
  }
}
