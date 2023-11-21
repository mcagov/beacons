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
    beaconOwner.setMain(true); // For now, all owners created (1) is the main one.
    return beaconOwnerRepository.save(beaconOwner);
  }

  public Optional<BeaconOwner> getByBeaconId(BeaconId beaconId) {
    List<BeaconOwner> beaconOwners = beaconOwnerRepository.getByBeaconId(
      beaconId
    );

    return getMainOwner(beaconOwners);
  }

  public Optional<BeaconOwner> getMainOwner(List<BeaconOwner> beaconOwners) {
    if (beaconOwners.isEmpty()) {
      return Optional.empty();
    }

    Optional<BeaconOwner> mainBeaconOwner = beaconOwners
      .stream()
      .filter(BeaconOwner::isMain)
      .findFirst();

    return mainBeaconOwner.or(() -> Optional.of(beaconOwners.get(0)));
  }

  public List<BeaconOwner> getOwnersByBeaconId(BeaconId beaconId) {
    return beaconOwnerRepository.getByBeaconId(beaconId);
  }

  public void deleteByBeaconId(BeaconId beaconId) {
    beaconOwnerRepository.deleteAllByBeaconId(beaconId);
    beaconOwnerRepository.flush();
  }
}
