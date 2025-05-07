package uk.gov.mca.beacons.api.search.jobs.steps;

import java.util.List;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.beaconowner.application.BeaconOwnerHelper;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwner;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwnerReadOnlyRepository;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwnerRepository;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUseReadOnlyRepository;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUseRepository;
import uk.gov.mca.beacons.api.search.documents.BeaconSearchDocument;

@Component
public class ReindexSearchBeaconProcessor
  implements ItemProcessor<Beacon, BeaconSearchDocument> {

  private final BeaconOwnerReadOnlyRepository beaconOwnerRepository;
  private final BeaconUseReadOnlyRepository beaconUseRepository;

  @Autowired
  public ReindexSearchBeaconProcessor(
    BeaconOwnerReadOnlyRepository beaconOwnerRepository,
    BeaconUseReadOnlyRepository beaconUseRepository
  ) {
    this.beaconOwnerRepository = beaconOwnerRepository;
    this.beaconUseRepository = beaconUseRepository;
  }

  @Transactional(propagation = Propagation.REQUIRES_NEW, readOnly = true)
  @Override
  public BeaconSearchDocument process(Beacon beacon) {
    BeaconId beaconId = beacon.getId();

    List<BeaconOwner> beaconOwners = beaconOwnerRepository.getByBeaconId(
      beaconId
    );

    BeaconOwner beaconMainOwner = BeaconOwnerHelper
      .getMainOwner(beaconOwners)
      .orElse(null);

    List<BeaconUse> beaconUses = beaconUseRepository.findBeaconUsesByBeaconId(
      beaconId
    );

    return new BeaconSearchDocument(beacon, beaconMainOwner, beaconUses);
  }
}
