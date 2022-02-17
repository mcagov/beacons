package uk.gov.mca.beacons.api.jobs.steps;

import java.util.List;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwner;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwnerRepository;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUseRepository;
import uk.gov.mca.beacons.api.search.documents.BeaconSearchDocument;

@Component
public class ReindexSearchBeaconProcessor
  implements ItemProcessor<Beacon, BeaconSearchDocument> {

  private final BeaconOwnerRepository beaconOwnerRepository;
  private final BeaconUseRepository beaconUseRepository;

  @Autowired
  public ReindexSearchBeaconProcessor(
    BeaconOwnerRepository beaconOwnerRepository,
    BeaconUseRepository beaconUseRepository
  ) {
    this.beaconOwnerRepository = beaconOwnerRepository;
    this.beaconUseRepository = beaconUseRepository;
  }

  @Override
  public BeaconSearchDocument process(Beacon beacon) {
    BeaconId beaconId = beacon.getId();
    BeaconOwner beaconOwner = beaconOwnerRepository
      .findBeaconOwnerByBeaconId(beaconId)
      .orElse(null);
    List<BeaconUse> beaconUses = beaconUseRepository.getBeaconUseByBeaconId(
      beaconId
    );

    return new BeaconSearchDocument(beacon, beaconOwner, beaconUses);
  }
}
