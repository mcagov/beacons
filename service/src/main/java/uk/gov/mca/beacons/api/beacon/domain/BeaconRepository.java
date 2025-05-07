package uk.gov.mca.beacons.api.beacon.domain;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderId;

@Repository
public interface BeaconRepository extends JpaRepository<Beacon, BeaconId> {
  List<Beacon> getByAccountHolderId(AccountHolderId accountHolderId);

  List<Beacon> getByAccountHolderIdAndBeaconStatus(
    AccountHolderId accountHolderId,
    BeaconStatus beaconStatus
  );

  Optional<Beacon> getByIdAndAccountHolderIdAndBeaconStatus(
    BeaconId beaconId,
    AccountHolderId accountHolderId,
    BeaconStatus beaconStatus
  );

  List<Beacon> getByAccountHolderIdAndBeaconStatusIn(
    AccountHolderId accountHolderId,
    Collection<BeaconStatus> beaconStatuses
  );

  Optional<Beacon> getByIdAndAccountHolderIdAndBeaconStatusIn(
    BeaconId beaconId,
    AccountHolderId accountHolderId,
    Collection<BeaconStatus> beaconStatuses
  );

  List<Beacon> findAll();
}
