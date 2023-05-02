package uk.gov.mca.beacons.api.note.domain;

import java.util.List;
import javax.persistence.QueryHint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.QueryHints;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;

public interface NoteReadOnlyRepository extends JpaRepository<Note, NoteId> {
  @QueryHints({ @QueryHint(name = "org.hibernate.readOnly", value = "true") })
  List<Note> findByBeaconId(BeaconId beaconId);
}
