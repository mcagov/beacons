package uk.gov.mca.beacons.api.search;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.beacon.domain.BeaconRepository;
import uk.gov.mca.beacons.api.beaconowner.application.BeaconOwnerHelper;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwner;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwnerRepository;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUseRepository;
import uk.gov.mca.beacons.api.comparison.rest.ComparisonResult;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeaconId;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeaconRepository;
import uk.gov.mca.beacons.api.search.beacons.repositories.BeaconSearchSpecificationRepository;
import uk.gov.mca.beacons.api.search.beacons.rest.BeaconSearchSpecification;
import uk.gov.mca.beacons.api.search.documents.BeaconSearchDocument;
import uk.gov.mca.beacons.api.search.domain.BeaconOverview;
import uk.gov.mca.beacons.api.search.domain.BeaconSearchEntity;
import uk.gov.mca.beacons.api.search.repositories.BeaconSearchRepository;

@Service
public class BeaconSearchService {

  private final BeaconSearchRepository beaconSearchRepository;
  private final BeaconSearchSpecificationRepository beaconSearchSpecificationRepository;
  private final BeaconRepository beaconRepository;
  private final BeaconOwnerRepository beaconOwnerRepository;
  private final BeaconUseRepository beaconUseRepository;
  private final LegacyBeaconRepository legacyBeaconRepository;

  @Autowired
  public BeaconSearchService(
    BeaconSearchRepository beaconElasticSearchRepository,
    BeaconSearchSpecificationRepository beaconSearchSpecificationRepository,
    BeaconRepository beaconRepository,
    BeaconOwnerRepository beaconOwnerRepository,
    BeaconUseRepository beaconUseRepository,
    LegacyBeaconRepository legacyBeaconRepository
  ) {
    this.beaconSearchRepository = beaconElasticSearchRepository;
    this.beaconSearchSpecificationRepository =
      beaconSearchSpecificationRepository;
    this.beaconRepository = beaconRepository;
    this.beaconOwnerRepository = beaconOwnerRepository;
    this.beaconUseRepository = beaconUseRepository;
    this.legacyBeaconRepository = legacyBeaconRepository;
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

    List<BeaconOwner> owners = beaconOwnerRepository.getByBeaconId(
      beacon.getId()
    );

    BeaconOwner owner = BeaconOwnerHelper.getMainOwner(owners).orElse(null);

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

  public BeaconSearchDocument index(LegacyBeaconId legacyBeaconId) {
    LegacyBeacon legacyBeacon = legacyBeaconRepository
      .findById(legacyBeaconId)
      .orElseThrow(IllegalArgumentException::new);

    BeaconSearchDocument beaconSearchDocument = new BeaconSearchDocument(
      legacyBeacon
    );

    return beaconSearchRepository.save(beaconSearchDocument);
  }

  public ComparisonResult compareDataSources() {
    List<BeaconOverview> dbBeacons = getBeaconOverviews();
    List<UUID> opensearchBeaconIds = getBeaconSearchIds();

    List<BeaconOverview> missingBeacons = dbBeacons
      .stream()
      .filter(bo -> !opensearchBeaconIds.contains(bo.getId()))
      .collect(Collectors.toList());

    ComparisonResult result = new ComparisonResult();
    result.setDbCount(dbBeacons.size());
    result.setOpenSearchCount(opensearchBeaconIds.size());
    result.setMissingCount(missingBeacons.size());
    result.setMissing(missingBeacons);

    return result;
  }

  public Page<BeaconSearchEntity> findAllBeacons(
    String status,
    String uses,
    String hexId,
    String ownerName,
    String cospasSarsatNumber,
    String manufacturerSerialNumber,
    Pageable pageable
  ) {
    Specification<BeaconSearchEntity> spec = Specification.where(
      BeaconSearchSpecification.hasStatus(status)
    )
      .and(BeaconSearchSpecification.hasUses(uses))
      .and(BeaconSearchSpecification.hasHexId(hexId))
      .and(BeaconSearchSpecification.hasOwnerName(ownerName))
      .and(BeaconSearchSpecification.hasCospasSarsatNumber(cospasSarsatNumber))
      .and(
        BeaconSearchSpecification.hasManufacturerSerialNumber(
          manufacturerSerialNumber
        )
      );

    Page<BeaconSearchEntity> results =
      beaconSearchSpecificationRepository.findAll(spec, pageable);

    return results.getContent().isEmpty() ? Page.empty(pageable) : results;
  }

  private List<BeaconOverview> getBeaconOverviews() {
    List<BeaconOverview> overviews = beaconRepository
      .findAll()
      .stream()
      .map(b ->
        new BeaconOverview(
          b.getId().unwrap(),
          b.getHexId(),
          b.getLastModifiedDate()
        )
      )
      .collect(Collectors.toList());
    List<BeaconOverview> legacyOverviews = legacyBeaconRepository
      .findAll()
      .stream()
      .map(lb ->
        new BeaconOverview(
          lb.getId().unwrap(),
          lb.getHexId(),
          lb.getLastModifiedDate()
        )
      )
      .collect(Collectors.toList());

    overviews.addAll(legacyOverviews);

    return overviews;
  }

  private List<UUID> getBeaconSearchIds() {
    List<UUID> searchIds = new ArrayList<>();
    Iterable<BeaconSearchDocument> response = beaconSearchRepository.findAll();

    response.forEach(bsd -> searchIds.add(bsd.getId()));

    return searchIds;
  }
}
