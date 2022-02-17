package uk.gov.mca.beacons.api.legacybeacon.hibernate;

import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeaconId;
import uk.gov.mca.beacons.api.shared.hibernate.DomainObjectIdCustomType;
import uk.gov.mca.beacons.api.shared.hibernate.DomainObjectIdTypeDescriptor;

public class LegacyBeaconIdType
  extends DomainObjectIdCustomType<LegacyBeaconId> {

  private static final DomainObjectIdTypeDescriptor<LegacyBeaconId> TYPE_DESCRIPTOR = new DomainObjectIdTypeDescriptor<>(
    LegacyBeaconId.class,
    LegacyBeaconId::new
  );

  public LegacyBeaconIdType() {
    super(TYPE_DESCRIPTOR);
  }
}
