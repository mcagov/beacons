package uk.gov.mca.beacons.api.beaconuse.domain;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;

@Repository("BeaconUseRepositoyV2")
public interface BeaconUseRepository
  extends JpaRepository<BeaconUse, BeaconUseId> {
  List<BeaconUse> getBeaconUseByBeaconId(BeaconId beaconId);
  Long deleteAllByBeaconId(BeaconId beaconId);
}
