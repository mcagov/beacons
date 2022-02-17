package uk.gov.mca.beacons.api.emergencycontact.application;

import java.util.List;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.emergencycontact.domain.EmergencyContact;
import uk.gov.mca.beacons.api.emergencycontact.domain.EmergencyContactRepository;

@Transactional
@Service("EmergencyContactServiceV2")
public class EmergencyContactService {

  private final EmergencyContactRepository emergencyContactRepository;

  @Autowired
  public EmergencyContactService(
    EmergencyContactRepository emergencyContactRepository
  ) {
    this.emergencyContactRepository = emergencyContactRepository;
  }

  public List<EmergencyContact> createAll(
    List<EmergencyContact> emergencyContacts
  ) {
    return emergencyContactRepository.saveAll(emergencyContacts);
  }

  public List<EmergencyContact> getByBeaconId(BeaconId beaconId) {
    return emergencyContactRepository.getByBeaconId(beaconId);
  }

  public void deleteByBeaconId(BeaconId beaconId) {
    emergencyContactRepository.deleteAllByBeaconId(beaconId);
    emergencyContactRepository.flush();
  }
}
