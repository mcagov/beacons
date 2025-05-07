package uk.gov.mca.beacons.api.export;

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
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUseReadOnlyRepository;
import uk.gov.mca.beacons.api.emergencycontact.domain.EmergencyContact;
import uk.gov.mca.beacons.api.emergencycontact.domain.EmergencyContactReadOnlyRepository;
import uk.gov.mca.beacons.api.export.xlsx.ExportSpreadsheetRow;

@Component
class BeaconToSpreadsheetRowItemProcessor
  implements ItemProcessor<Beacon, ExportSpreadsheetRow> {

  private final BeaconOwnerReadOnlyRepository beaconOwnerRepository;
  private final BeaconUseReadOnlyRepository beaconUseRepository;
  private final EmergencyContactReadOnlyRepository emergencyContactRepository;

  @Autowired
  public BeaconToSpreadsheetRowItemProcessor(
    BeaconOwnerReadOnlyRepository beaconOwnerRepository,
    BeaconUseReadOnlyRepository beaconUseRepository,
    EmergencyContactReadOnlyRepository emergencyContactRepository
  ) {
    this.beaconOwnerRepository = beaconOwnerRepository;
    this.beaconUseRepository = beaconUseRepository;
    this.emergencyContactRepository = emergencyContactRepository;
  }

  @Transactional(propagation = Propagation.REQUIRES_NEW, readOnly = true)
  @Override
  public ExportSpreadsheetRow process(Beacon beacon) {
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
    List<EmergencyContact> emergencyContacts = emergencyContactRepository.findEmergencyContactsByBeaconId(
      beaconId
    );

    return new ExportSpreadsheetRow(
      beacon,
      beaconMainOwner,
      beaconUses,
      emergencyContacts
    );
  }
}
