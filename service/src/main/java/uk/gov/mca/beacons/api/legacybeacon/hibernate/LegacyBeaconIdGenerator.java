package uk.gov.mca.beacons.api.legacybeacon.hibernate;

import java.io.Serializable;
import java.util.UUID;
import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeaconId;

public class LegacyBeaconIdGenerator implements IdentifierGenerator {

  public static final String STRATEGY =
    "uk.gov.mca.beacons.api.legacybeacon.hibernate.LegacyBeaconIdGenerator";

  @Override
  public Serializable generate(
    SharedSessionContractImplementor session,
    Object object
  ) throws HibernateException {
    return new LegacyBeaconId(UUID.randomUUID());
  }
}
