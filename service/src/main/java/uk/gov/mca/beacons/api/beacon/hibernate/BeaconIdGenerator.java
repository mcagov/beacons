package uk.gov.mca.beacons.api.beacon.hibernate;

import java.io.Serializable;
import java.util.UUID;
import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;

public class BeaconIdGenerator implements IdentifierGenerator {

  public static final String STRATEGY =
    "uk.gov.mca.beacons.api.beacon.hibernate.BeaconIdGenerator";

  @Override
  public Serializable generate(
    SharedSessionContractImplementor session,
    Object object
  ) throws HibernateException {
    return new BeaconId(UUID.randomUUID());
  }
}
