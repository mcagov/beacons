package uk.gov.mca.beacons.service.repository;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uk.gov.mca.beacons.service.model.Beacon;

@Repository
public interface BeaconRepository extends JpaRepository<Beacon, UUID> {
  List<Beacon> findByAccountHolderId(UUID accountId);
}
