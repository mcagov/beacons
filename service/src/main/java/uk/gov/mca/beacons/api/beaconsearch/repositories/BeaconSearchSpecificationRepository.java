package uk.gov.mca.beacons.api.beaconsearch.repositories;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import uk.gov.mca.beacons.api.search.domain.BeaconSearchEntity;

public interface BeaconSearchSpecificationRepository
  extends
    JpaRepository<BeaconSearchEntity, UUID>,
    JpaSpecificationExecutor<BeaconSearchEntity> {}
