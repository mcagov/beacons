package uk.gov.mca.beacons.api.search;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.apache.commons.collections.IteratorUtils;
import org.apache.http.HttpHost;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.*;
import org.elasticsearch.common.unit.TimeValue;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

  public ComparisonResult compareDataSources() throws IOException {
    HashMap<UUID, BeaconOverview> dbBeacons = getBeaconOverviews();

    ComparisonResult result = new ComparisonResult();
    result.setDbCount(dbBeacons.size());
    result.setDbBeacons(dbBeacons);

    return result;
  }

  private HashMap<UUID, BeaconOverview> getBeaconOverviews() {
    Map<UUID, BeaconOverview> overviews = beaconRepository
      .findAll()
      .stream()
      .collect(
        Collectors.toMap(Beacon::getUnwrappedId, b -> b.getBeaconOverview())
      );

    Map<UUID, BeaconOverview> legacyOverviews = legacyBeaconRepository
      .findAll()
      .stream()
      .collect(
        Collectors.toMap(
          LegacyBeacon::getUnwrappedId,
          b -> b.getBeaconOverview()
        )
      );

    overviews.putAll(legacyOverviews);

    return (HashMap<UUID, BeaconOverview>) overviews;
  }
}
