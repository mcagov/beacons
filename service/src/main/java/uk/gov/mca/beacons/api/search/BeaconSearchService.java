package uk.gov.mca.beacons.api.search;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.apache.commons.collections.IteratorUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uk.gov.mca.beacons.api.beacon.application.BeaconService;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.beacon.domain.BeaconRepository;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwner;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwnerRepository;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUseRepository;
import uk.gov.mca.beacons.api.comparison.rest.ComparisonResult;
import uk.gov.mca.beacons.api.legacybeacon.application.LegacyBeaconService;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeaconId;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeaconRepository;
import uk.gov.mca.beacons.api.search.documents.BeaconSearchDocument;
import uk.gov.mca.beacons.api.search.domain.BeaconOverview;
import uk.gov.mca.beacons.api.search.repositories.BeaconSearchRepository;

@Service
public class BeaconSearchService {

  BeaconSearchRepository beaconSearchRepository;
  BeaconRepository beaconRepository;
  BeaconOwnerRepository beaconOwnerRepository;
  BeaconUseRepository beaconUseRepository;
  LegacyBeaconRepository legacyBeaconRepository;

  BeaconService beaconService;
  LegacyBeaconService legacyBeaconService;
  private final int batchSize = 200;

  @Autowired
  public BeaconSearchService(
    BeaconSearchRepository beaconSearchRepository,
    BeaconRepository beaconRepository,
    BeaconOwnerRepository beaconOwnerRepository,
    BeaconUseRepository beaconUseRepository,
    LegacyBeaconRepository legacyBeaconRepository,
    BeaconService beaconService,
    LegacyBeaconService legacyBeaconService
  ) {
    this.beaconSearchRepository = beaconSearchRepository;
    this.beaconRepository = beaconRepository;
    this.beaconOwnerRepository = beaconOwnerRepository;
    this.beaconUseRepository = beaconUseRepository;
    this.legacyBeaconRepository = legacyBeaconRepository;
    this.beaconService = beaconService;
    this.legacyBeaconService = legacyBeaconService;
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
    List<UUID> opensearchBeaconIds = List.of(UUID.randomUUID()); //getBeaconSearchIds();

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

  private List<BeaconOverview> getBeaconOverviews() {
    // todo: Sam's original code with a timeout of 100000 mostly works
    // only thing that doesn't is opensearch results
    ArrayList<BeaconOverview> overviews = new ArrayList<>();

    int totalNumberOfModernBeacons = beaconRepository.findAll().size();
    int numberProcessedSoFar = 0;
    int numberLeftToProcess = totalNumberOfModernBeacons;

    if (numberLeftToProcess > this.batchSize) {
      while (numberLeftToProcess > 0) {
        List<Beacon> batchOfBeacons = beaconService.getBatch(
          this.batchSize,
          numberProcessedSoFar
        );

        overviews.addAll(
          batchOfBeacons
            .stream()
            .map(b ->
              new BeaconOverview(
                b.getId().unwrap(),
                b.getHexId(),
                b.getLastModifiedDate()
              )
            )
            .collect(Collectors.toList())
        );

        numberProcessedSoFar += this.batchSize;
        numberLeftToProcess -= this.batchSize;
      }
    } else {
      List<Beacon> remainingBeacons = beaconService.getBatch(
        numberLeftToProcess,
        numberProcessedSoFar
      );

      overviews.addAll(
        remainingBeacons
          .stream()
          .map(b ->
            new BeaconOverview(
              b.getId().unwrap(),
              b.getHexId(),
              b.getLastModifiedDate()
            )
          )
          .collect(Collectors.toList())
      );
    }

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

  // todo: batch using the scroll api because 'window is too large, from + size must be less than or equal to: [10000] but was [24329]'
  private List<UUID> getBeaconSearchIds() {
    List<UUID> searchIds = new ArrayList<>();
    Iterable<BeaconSearchDocument> response = beaconSearchRepository.findAll();

    response.forEach(bsd -> searchIds.add(bsd.getId()));

    return searchIds;
  }
}
