package uk.gov.mca.beacons.api.emergencycontact.domain;

import java.util.List;
import javax.persistence.QueryHint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.stereotype.Repository;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;

@Repository("EmergencyContactReadOnlyRepository")
public interface EmergencyContactReadOnlyRepository
  extends JpaRepository<EmergencyContact, EmergencyContactId> {
  @QueryHints({ @QueryHint(name = "org.hibernate.readOnly", value = "true") })
  List<EmergencyContact> findEmergencyContactsByBeaconId(BeaconId beaconId);
}
