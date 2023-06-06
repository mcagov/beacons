package uk.gov.mca.beacons.api.legacybeacon.domain;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LegacyBeaconRepository
  extends JpaRepository<LegacyBeacon, LegacyBeaconId> {
  List<LegacyBeacon> findByHexId(String hexId);
  List<LegacyBeacon> findByHexIdAndOwnerEmail(String hexId, String ownerEmail);
  List<LegacyBeacon> findByHexIdAndRecoveryEmail(
    String hexId,
    String recoveryEmail
  );
}
