package uk.gov.mca.beacons.api.emergencycontact.domain;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;

@Repository
public interface EmergencyContactRepository
  extends JpaRepository<EmergencyContact, EmergencyContactId> {
  List<EmergencyContact> getByBeaconId(BeaconId beaconId);
  Long deleteAllByBeaconId(BeaconId beaconId);
}
