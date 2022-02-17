package uk.gov.mca.beacons.api.note.domain;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;

public interface NoteRepository extends JpaRepository<Note, NoteId> {
  List<Note> findByBeaconId(BeaconId beaconId);
}
