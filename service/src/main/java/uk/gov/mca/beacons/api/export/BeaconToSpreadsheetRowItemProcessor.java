package uk.gov.mca.beacons.api.export;

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
import uk.gov.mca.beacons.api.emergencycontact.domain.EmergencyContact;
import uk.gov.mca.beacons.api.emergencycontact.domain.EmergencyContactRepository;
import uk.gov.mca.beacons.api.export.SpreadsheetRow;

@Component
class BeaconToSpreadsheetRowItemProcessor
  implements ItemProcessor<Beacon, SpreadsheetRow> {

  private final BeaconOwnerRepository beaconOwnerRepository;
  private final BeaconUseRepository beaconUseRepository;
  private final EmergencyContactRepository emergencyContactRepository;

  @Autowired
  public BeaconToSpreadsheetRowItemProcessor(
    BeaconOwnerRepository beaconOwnerRepository,
    BeaconUseRepository beaconUseRepository,
    EmergencyContactRepository emergencyContactRepository
  ) {
    this.beaconOwnerRepository = beaconOwnerRepository;
    this.beaconUseRepository = beaconUseRepository;
    this.emergencyContactRepository = emergencyContactRepository;
  }

  @Override
  public SpreadsheetRow process(Beacon beacon) {
    BeaconId beaconId = beacon.getId();
    BeaconOwner beaconOwner = beaconOwnerRepository
      .findBeaconOwnerByBeaconId(beaconId)
      .orElse(null);
    List<BeaconUse> beaconUses = beaconUseRepository.getBeaconUseByBeaconId(
      beaconId
    );
    List<EmergencyContact> emergencyContacts = emergencyContactRepository.getByBeaconId(
      beaconId
    );

    return new SpreadsheetRow(
      beacon,
      beaconOwner,
      beaconUses,
      emergencyContacts
    );
  }
}
