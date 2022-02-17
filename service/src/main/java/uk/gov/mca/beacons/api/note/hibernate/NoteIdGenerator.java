package uk.gov.mca.beacons.api.note.hibernate;

import java.io.Serializable;
import java.util.UUID;
import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;
import uk.gov.mca.beacons.api.note.domain.NoteId;

public class NoteIdGenerator implements IdentifierGenerator {

  public static final String STRATEGY =
    "uk.gov.mca.beacons.api.note.hibernate.NoteIdGenerator";

  @Override
  public Serializable generate(
    SharedSessionContractImplementor session,
    Object object
  ) throws HibernateException {
    return new NoteId(UUID.randomUUID());
  }
}
