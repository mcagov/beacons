package uk.gov.mca.beacons.api.beaconowner.application;

import java.util.List;
import java.util.Optional;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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

  //TODO: Refactor this code
  public Optional<BeaconOwner> getByBeaconId(BeaconId beaconId) {
    // There is a one to zero or one mapping between beacons and beacon owners, therefore we either return null
    // or the first element in the beacon owners list (there should only be one element)
    List<BeaconOwner> beaconOwners = beaconOwnerRepository.getByBeaconId(
      beaconId
    );
    if (beaconOwners.size() == 0) {
      return Optional.empty();
    }
    return Optional.of(beaconOwners.get(0));
  }

  public void deleteByBeaconId(BeaconId beaconId) {
    beaconOwnerRepository.deleteAllByBeaconId(beaconId);
    beaconOwnerRepository.flush();
  }
}
