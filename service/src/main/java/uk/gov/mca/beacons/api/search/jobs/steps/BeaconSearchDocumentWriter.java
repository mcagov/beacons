package uk.gov.mca.beacons.api.search.jobs.steps;

import java.util.List;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.search.documents.BeaconSearchDocument;
import uk.gov.mca.beacons.api.search.repositories.BeaconElasticSearchRepository;

@Component
public class BeaconSearchDocumentWriter
  implements ItemWriter<BeaconSearchDocument> {

  private final BeaconElasticSearchRepository beaconElasticSearchRepository;

  @Autowired
  public BeaconSearchDocumentWriter(
    BeaconElasticSearchRepository beaconElasticSearchRepository
  ) {
    this.beaconElasticSearchRepository = beaconElasticSearchRepository;
  }

  @Override
  public void write(@NonNull List<? extends BeaconSearchDocument> documents) {
    beaconElasticSearchRepository.saveAll(documents);
  }
}
