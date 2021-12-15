package uk.gov.mca.beacons.api.beaconuse.application;

import java.util.List;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUseRepository;

@Transactional
@Service("BeaconUseServiceV2")
public class BeaconUseService {

  private final BeaconUseRepository beaconUseRepository;

  @Autowired
  public BeaconUseService(BeaconUseRepository beaconUseRepository) {
    this.beaconUseRepository = beaconUseRepository;
  }

  public List<BeaconUse> createAll(List<BeaconUse> beaconUses) {
    return beaconUseRepository.saveAll(beaconUses);
  }
}
