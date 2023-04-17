package uk.gov.mca.beacons.api.beacon.domain;

import java.util.List;
import java.util.Optional;
import javax.persistence.QueryHint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.stereotype.Repository;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderId;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwner;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwnerId;

@Repository("BeaconReadOnlyRepository")
public interface BeaconReadOnlyRepository
  extends JpaRepository<Beacon, BeaconId> {
  @QueryHints({ @QueryHint(name = "org.hibernate.readOnly", value = "true") })
  List<Beacon> getByAccountHolderId(AccountHolderId accountHolderId);

  @QueryHints({ @QueryHint(name = "org.hibernate.readOnly", value = "true") })
  List<Beacon> getByAccountHolderIdAndBeaconStatus(
    AccountHolderId accountHolderId,
    BeaconStatus beaconStatus
  );

  @QueryHints({ @QueryHint(name = "org.hibernate.readOnly", value = "true") })
  Optional<Beacon> getByIdAndAccountHolderIdAndBeaconStatus(
    BeaconId beaconId,
    AccountHolderId accountHolderId,
    BeaconStatus beaconStatus
  );

  @QueryHints({ @QueryHint(name = "org.hibernate.readOnly", value = "true") })
  List<Beacon> findAll();
}
