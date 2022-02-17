@TypeDef(defaultForType = NoteId.class, typeClass = NoteIdType.class)
@GenericGenerator(
  name = Note.ID_GENERATOR_NAME,
  strategy = NoteIdGenerator.STRATEGY
)
package uk.gov.mca.beacons.api.note.hibernate;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.TypeDef;
import uk.gov.mca.beacons.api.note.domain.Note;
import uk.gov.mca.beacons.api.note.domain.NoteId;
import uk.gov.mca.beacons.api.note.hibernate.NoteIdGenerator;
