package uk.gov.mca.beacons.api.search.beacons.repositories;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import uk.gov.mca.beacons.api.search.domain.BeaconSearchEntity;

@Repository
public interface BeaconSearchSpecificationRepository
  extends
    JpaRepository<BeaconSearchEntity, UUID>,
    JpaSpecificationExecutor<BeaconSearchEntity> {}
