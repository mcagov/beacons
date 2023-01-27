package uk.gov.mca.beacons.api.search.repositories;

import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.repository.CrudRepository;
import uk.gov.mca.beacons.api.search.documents.BeaconSearchDocument;

public interface BeaconSearchRepository
  extends ElasticsearchRepository<BeaconSearchDocument, UUID> {
  BeaconSearchDocument findBeaconSearchDocumentByHexId(String hexId);
  Stream<BeaconSearchDocument> findBy();
}
