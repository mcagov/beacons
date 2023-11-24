package uk.gov.mca.beacons.api.beaconowner.application;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwner;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwnerRepository;

@Transactional
@Service("BeaconOwnerServiceV2")
public class BeaconOwnerService {

  private final BeaconOwnerRepository beaconOwnerRepository;

  @Autowired
  public BeaconOwnerService(BeaconOwnerRepository beaconOwnerRepository) {
    this.beaconOwnerRepository = beaconOwnerRepository;
  }

  public BeaconOwner create(BeaconOwner beaconOwner) {
    return beaconOwnerRepository.save(beaconOwner);
  }

  public Optional<BeaconOwner> getByBeaconId(BeaconId beaconId) {
    List<BeaconOwner> beaconOwners = beaconOwnerRepository.getByBeaconId(
      beaconId
    );

    return getMainOwner(beaconOwners);
  }

  public Optional<BeaconOwner> getMainOwner(List<BeaconOwner> beaconOwners) {
    return BeaconOwnerHelper.getMainOwner(beaconOwners);
  }

  public List<BeaconOwner> getOwnersByBeaconId(BeaconId beaconId) {
    return beaconOwnerRepository.getByBeaconId(beaconId);
  }

  public void deleteByBeaconId(BeaconId beaconId) {
    beaconOwnerRepository.deleteAllByBeaconId(beaconId);
    beaconOwnerRepository.flush();
  }
}
