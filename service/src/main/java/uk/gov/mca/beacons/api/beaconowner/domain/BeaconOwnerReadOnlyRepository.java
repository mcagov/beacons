package uk.gov.mca.beacons.api.beaconowner.domain;

import java.util.List;
import java.util.Optional;
import javax.persistence.QueryHint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.stereotype.Repository;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;

@Repository("BeaconOwnerReadOnlyRepository")
public interface BeaconOwnerReadOnlyRepository
  extends JpaRepository<BeaconOwner, BeaconOwnerId> {
  @QueryHints({ @QueryHint(name = "org.hibernate.readOnly", value = "true") })
  List<BeaconOwner> getByBeaconId(BeaconId beaconId);

  @QueryHints({ @QueryHint(name = "org.hibernate.readOnly", value = "true") })
  Optional<BeaconOwner> findBeaconOwnerByBeaconId(BeaconId beaconId);
}
