package uk.gov.mca.beacons.api.jobs.steps;

import java.util.List;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.search.documents.BeaconSearchDocument;
import uk.gov.mca.beacons.api.search.repositories.BeaconSearchRepository;

@Component
public class BeaconSearchDocumentWriter
  implements ItemWriter<BeaconSearchDocument> {

  private final BeaconSearchRepository beaconSearchRepository;

  @Autowired
  public BeaconSearchDocumentWriter(
    BeaconSearchRepository beaconSearchRepository
  ) {
    this.beaconSearchRepository = beaconSearchRepository;
  }

  @Override
  public void write(@NonNull List<? extends BeaconSearchDocument> documents)
    throws Exception {
    beaconSearchRepository.saveAll(documents);
  }
}
