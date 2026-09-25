package uk.gov.mca.beacons.api.beaconuse.domain;

import java.util.List;
import javax.persistence.QueryHint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.stereotype.Repository;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;

@Repository("BeaconUseReadOnlyRepository")
public interface BeaconUseReadOnlyRepository
  extends JpaRepository<BeaconUse, BeaconUseId> {
  @QueryHints({ @QueryHint(name = "org.hibernate.readOnly", value = "true") })
  List<BeaconUse> findBeaconUsesByBeaconId(BeaconId beaconId);
}
