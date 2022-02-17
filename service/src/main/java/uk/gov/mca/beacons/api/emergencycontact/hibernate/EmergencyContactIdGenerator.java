package uk.gov.mca.beacons.api.emergencycontact.hibernate;

import java.io.Serializable;
import java.util.UUID;
import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;
import uk.gov.mca.beacons.api.emergencycontact.domain.EmergencyContactId;

public class EmergencyContactIdGenerator implements IdentifierGenerator {

  public static final String STRATEGY =
    "uk.gov.mca.beacons.api.emergencycontact.hibernate.EmergencyContactIdGenerator";

  @Override
  public Serializable generate(
    SharedSessionContractImplementor session,
    Object object
  ) throws HibernateException {
    return new EmergencyContactId(UUID.randomUUID());
  }
}
