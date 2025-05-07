package uk.gov.mca.beacons.api.beaconuse.application;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.auditing.AuditingHandler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUseRepository;
import uk.gov.mca.beacons.api.mappers.ModelPatcherFactory;

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

  public List<BeaconUse> getByBeaconId(BeaconId beaconId) {
    return beaconUseRepository.getBeaconUseByBeaconId(beaconId);
  }

  public BeaconUse getMainUseByBeaconId(BeaconId beaconId) {
    return getByBeaconId(beaconId)
      .stream()
      .filter(bu -> bu != null && Boolean.TRUE.equals(bu.getMainUse()))
      .findFirst()
      .orElse(null);
  }

  public void deleteByBeaconId(BeaconId beaconId) {
    beaconUseRepository.deleteAllByBeaconId(beaconId);
    beaconUseRepository.flush();
  }
}
