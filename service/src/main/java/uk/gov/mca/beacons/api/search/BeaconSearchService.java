package uk.gov.mca.beacons.api.search;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfigureOrder;
import org.springframework.stereotype.Service;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.beacon.domain.BeaconRepository;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwner;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwnerRepository;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUseRepository;
import uk.gov.mca.beacons.api.exceptions.ResourceNotFoundException;
import uk.gov.mca.beacons.api.search.documents.BeaconSearchDocument;
import uk.gov.mca.beacons.api.search.repositories.BeaconSearchRepository;

@Service
public class BeaconSearchService {

  BeaconSearchRepository beaconSearchRepository;
  BeaconRepository beaconRepository;
  BeaconOwnerRepository beaconOwnerRepository;
  BeaconUseRepository beaconUseRepository;

  @Autowired
  public BeaconSearchService(
    BeaconSearchRepository beaconSearchRepository,
    BeaconRepository beaconRepository,
    BeaconOwnerRepository beaconOwnerRepository,
    BeaconUseRepository beaconUseRepository
  ) {
    this.beaconSearchRepository = beaconSearchRepository;
    this.beaconRepository = beaconRepository;
    this.beaconOwnerRepository = beaconOwnerRepository;
    this.beaconUseRepository = beaconUseRepository;
  }

  /**
   * Make the Beacon with id of beaconId searchable in OpenSearch
   *
   * @implNote  The "update registration" transaction sub-optimally crosses more than one aggregate boundary.
   * Therefore, here we update the BeaconSearchDocument as a unit.  The domain was initially modelled as a single
   * transaction.  If each aggregate had its own indexing operation, there would be a race condition where, for example,
   * a Use is indexed prior to the Beacon it references.  In future, each aggregate should be operated on as an atomic
   * transaction with its own event, and the dependency of this method on many aggregate repositories should be removed.
   *
   * @param beaconId The id of the beacon to be indexed
   * @return The BeaconSearchDocument
   */
  public BeaconSearchDocument index(BeaconId beaconId) {
    Beacon beacon = beaconRepository
      .findById(beaconId)
      .orElseThrow(IllegalArgumentException::new);
    BeaconOwner owner = beaconOwnerRepository
      .findBeaconOwnerByBeaconId(beacon.getId())
      .orElse(null);
    List<BeaconUse> uses = beaconUseRepository.getBeaconUseByBeaconId(
      beacon.getId()
    );

    BeaconSearchDocument beaconSearchDocument = new BeaconSearchDocument(
      beacon,
      owner,
      uses
    );
    return beaconSearchRepository.save(beaconSearchDocument);
  }
}
