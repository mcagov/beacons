package uk.gov.mca.beacons.api.search.repositories;

import java.util.UUID;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import uk.gov.mca.beacons.api.search.documents.BeaconSearchDocument;

public interface BeaconSearchRepository
  extends ElasticsearchRepository<BeaconSearchDocument, UUID> {
  BeaconSearchDocument findBeaconSearchDocumentByHexId(String hexId);
}
