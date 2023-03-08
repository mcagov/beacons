package uk.gov.mca.beacons.api.duplicates.domain;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderId;

@Repository
public interface DuplicatesRepository
  extends JpaRepository<DuplicatesSummary, String> {
  List<DuplicatesSummary> findAll();
  List<DuplicatesSummary> findByHexId(String hexId);
}
