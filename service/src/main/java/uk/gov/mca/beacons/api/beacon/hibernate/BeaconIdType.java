package uk.gov.mca.beacons.api.beacon.hibernate;

import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.shared.hibernate.DomainObjectIdCustomType;
import uk.gov.mca.beacons.api.shared.hibernate.DomainObjectIdTypeDescriptor;

public class BeaconIdType extends DomainObjectIdCustomType<BeaconId> {

  private static final DomainObjectIdTypeDescriptor<BeaconId> TYPE_DESCRIPTOR = new DomainObjectIdTypeDescriptor<>(
    BeaconId.class,
    BeaconId::new
  );

  public BeaconIdType() {
    super(TYPE_DESCRIPTOR);
  }
}
