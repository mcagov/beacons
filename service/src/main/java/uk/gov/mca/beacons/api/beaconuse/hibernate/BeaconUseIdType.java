package uk.gov.mca.beacons.api.beaconuse.hibernate;

import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUseId;
import uk.gov.mca.beacons.api.shared.hibernate.DomainObjectIdCustomType;
import uk.gov.mca.beacons.api.shared.hibernate.DomainObjectIdTypeDescriptor;

public class BeaconUseIdType extends DomainObjectIdCustomType<BeaconUseId> {

  private static final DomainObjectIdTypeDescriptor<BeaconUseId> TYPE_DESCRIPTOR = new DomainObjectIdTypeDescriptor<>(
    BeaconUseId.class,
    BeaconUseId::new
  );

  public BeaconUseIdType() {
    super(TYPE_DESCRIPTOR);
  }
}
