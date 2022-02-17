package uk.gov.mca.beacons.api.beaconowner.domain;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;

@Repository
public interface BeaconOwnerRepository
  extends JpaRepository<BeaconOwner, BeaconOwnerId> {
  List<BeaconOwner> getByBeaconId(BeaconId beaconId);
  Optional<BeaconOwner> findBeaconOwnerByBeaconId(BeaconId beaconId);
  Long deleteAllByBeaconId(BeaconId beaconId);
}
