package uk.gov.mca.beacons.api.jobs.steps;

import org.jetbrains.annotations.NotNull;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;
import uk.gov.mca.beacons.api.search.documents.BeaconSearchDocument;

@Component
public class ReindexSearchLegacyBeaconProcessor
  implements ItemProcessor<LegacyBeacon, BeaconSearchDocument> {

  @Override
  public BeaconSearchDocument process(@NotNull LegacyBeacon legacyBeacon) {
    return new BeaconSearchDocument(legacyBeacon);
  }
}
