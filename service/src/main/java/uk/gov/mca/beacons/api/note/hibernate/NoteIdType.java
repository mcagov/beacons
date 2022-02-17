package uk.gov.mca.beacons.api.note.hibernate;

import uk.gov.mca.beacons.api.note.domain.NoteId;
import uk.gov.mca.beacons.api.shared.hibernate.DomainObjectIdCustomType;
import uk.gov.mca.beacons.api.shared.hibernate.DomainObjectIdTypeDescriptor;

public class NoteIdType extends DomainObjectIdCustomType<NoteId> {

  private static final DomainObjectIdTypeDescriptor<NoteId> TYPE_DESCRIPTOR = new DomainObjectIdTypeDescriptor<>(
    NoteId.class,
    NoteId::new
  );

  public NoteIdType() {
    super(TYPE_DESCRIPTOR);
  }
}
