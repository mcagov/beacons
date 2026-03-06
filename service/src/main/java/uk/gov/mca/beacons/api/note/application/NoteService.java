package uk.gov.mca.beacons.api.note.application;

import java.util.List;
import java.util.stream.Collectors;
import org.checkerframework.checker.units.qual.N;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.note.domain.Note;
import uk.gov.mca.beacons.api.note.domain.NoteRepository;
import uk.gov.mca.beacons.api.note.domain.NoteType;
import uk.gov.mca.beacons.api.shared.domain.user.User;

@Transactional
@Service("NoteServiceV2")
public class NoteService {

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

  public List<Note> getNonSystemNotes(BeaconId beaconId) {
    return getByBeaconId(beaconId)
      .stream()
      .filter((note -> !(note.getFullName().equals("SYSTEM"))))
      .collect(Collectors.toList());
  }

  public Note createSystemNote(BeaconId beaconId, String text) {
    Note note = new Note();

    note.setFullName("SYSTEM");
    note.setType(NoteType.RECORD_HISTORY);
    note.setText(text);
    note.setBeaconId(beaconId);

    return noteRepository.save(note);
  }

  public Note createNoteForDeletedRegistration(
    User user,
    Beacon beacon,
    String reason,
    String fullNameOfDeletingUser,
    String templateReasonText
  ) {
    Note note = new Note();
    note.setFullName(fullNameOfDeletingUser);
    note.setUserId(user.getUserId());
    note.setType(NoteType.RECORD_HISTORY);
    note.setText(String.format(templateReasonText, reason));
    note.setBeaconId(beacon.getId());

    return noteRepository.save(note);
  }

  public void deleteByBeaconId(BeaconId beaconId) {
    noteRepository.deleteAllByBeaconId(beaconId);
    noteRepository.flush();
  }
}
