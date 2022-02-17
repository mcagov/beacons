package uk.gov.mca.beacons.api.note.application;

import java.util.List;
import java.util.Objects;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.note.domain.Note;
import uk.gov.mca.beacons.api.note.domain.NoteRepository;
import uk.gov.mca.beacons.api.note.domain.NoteType;
import uk.gov.mca.beacons.api.shared.domain.user.User;

@Transactional
@Service("NoteServiceV2")
public class NoteService {

  private static final String TEMPLATE_REASON_TEXT =
    "The account holder deleted the record with reason: '%s'";

  private final NoteRepository noteRepository;

  @Autowired
  public NoteService(NoteRepository noteRepository) {
    this.noteRepository = noteRepository;
  }

  public Note create(Note note) {
    return noteRepository.save(note);
  }

  public List<Note> getByBeaconId(BeaconId beaconId) {
    return noteRepository.findByBeaconId(beaconId);
  }

  public Note createNoteForDeletedRegistration(
    User user,
    Beacon beacon,
    String reason
  ) {
    Note note = new Note();
    note.setFullName("Account Holder");
    note.setUserId(user.getUserId());
    note.setType(NoteType.RECORD_HISTORY);
    note.setText(String.format(TEMPLATE_REASON_TEXT, reason));
    note.setBeaconId(beacon.getId());

    return noteRepository.save(note);
  }
}
