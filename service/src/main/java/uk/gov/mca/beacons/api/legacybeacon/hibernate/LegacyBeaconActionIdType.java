package uk.gov.mca.beacons.api.legacybeacon.hibernate;

import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeaconActionId;
import uk.gov.mca.beacons.api.shared.hibernate.DomainObjectIdCustomType;
import uk.gov.mca.beacons.api.shared.hibernate.DomainObjectIdTypeDescriptor;

public class LegacyBeaconActionIdType
  extends DomainObjectIdCustomType<LegacyBeaconActionId> {

  private static final DomainObjectIdTypeDescriptor<LegacyBeaconActionId> TYPE_DESCRIPTOR = new DomainObjectIdTypeDescriptor<>(
    LegacyBeaconActionId.class,
    LegacyBeaconActionId::new
  );

  public LegacyBeaconActionIdType() {
    super(TYPE_DESCRIPTOR);
  }
}
