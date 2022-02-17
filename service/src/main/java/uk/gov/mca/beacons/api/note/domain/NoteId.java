package uk.gov.mca.beacons.api.note.domain;

import java.util.UUID;
import uk.gov.mca.beacons.api.shared.domain.base.DomainObjectId;

public class NoteId extends DomainObjectId {

  public NoteId(UUID id) {
    super(id);
  }
}
