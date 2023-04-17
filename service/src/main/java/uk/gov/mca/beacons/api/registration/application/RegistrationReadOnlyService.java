package uk.gov.mca.beacons.api.registration.application;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.beacon.domain.BeaconStatus;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwner;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwnerReadOnlyRepository;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUseReadOnlyRepository;
import uk.gov.mca.beacons.api.emergencycontact.domain.EmergencyContact;
import uk.gov.mca.beacons.api.emergencycontact.domain.EmergencyContactReadOnlyRepository;
import uk.gov.mca.beacons.api.export.xlsx.backup.BeaconBackupItem;
import uk.gov.mca.beacons.api.note.domain.Note;
import uk.gov.mca.beacons.api.note.domain.NoteReadOnlyRepository;
import uk.gov.mca.beacons.api.registration.domain.Registration;

@Transactional
@Service("RegistrationReadOnlyService")
public class RegistrationReadOnlyService {

  private final BeaconOwnerReadOnlyRepository beaconOwnerRepository;
  private final BeaconUseReadOnlyRepository beaconUseRepository;
  private final EmergencyContactReadOnlyRepository emergencyContactRepository;

  private final NoteReadOnlyRepository noteRepository;

  @Autowired
  public RegistrationReadOnlyService(
    BeaconOwnerReadOnlyRepository beaconOwnerRepository,
    BeaconUseReadOnlyRepository beaconUseRepository,
    EmergencyContactReadOnlyRepository emergencyContactRepository,
    NoteReadOnlyRepository noteRepository
  ) {
    this.beaconOwnerRepository = beaconOwnerRepository;
    this.beaconUseRepository = beaconUseRepository;
    this.emergencyContactRepository = emergencyContactRepository;
    this.noteRepository = noteRepository;
  }

  public Registration getRegistrationFromBeaconBackupItem(
    BeaconBackupItem beaconBackupItem
  ) {
    BeaconId beaconId = new BeaconId(beaconBackupItem.getId());

    BeaconOwner beaconOwner = beaconOwnerRepository
      .findBeaconOwnerByBeaconId(beaconId)
      .orElse(null);
    List<BeaconUse> beaconUses = beaconUseRepository.findBeaconUsesByBeaconId(
      beaconId
    );
    List<EmergencyContact> emergencyContacts = emergencyContactRepository.findEmergencyContactsByBeaconId(
      beaconId
    );

    Registration registration = Registration
      .builder()
      .beacon(buildBeaconFromBeaconBackupItem(beaconBackupItem))
      .beaconOwner(beaconOwner)
      .beaconUses(beaconUses)
      .emergencyContacts(emergencyContacts)
      .build();

    return registration;
  }

  private Beacon buildBeaconFromBeaconBackupItem(
    BeaconBackupItem beaconBackupItem
  ) {
    return Beacon
      .builder()
      .id(new BeaconId(beaconBackupItem.getId()))
      .hexId(beaconBackupItem.getHexId())
      .beaconType(beaconBackupItem.getBeaconType())
      .beaconStatus(BeaconStatus.valueOf(beaconBackupItem.getBeaconStatus()))
      .csta(beaconBackupItem.getCsta())
      .model(beaconBackupItem.getModel())
      .mti(beaconBackupItem.getMti())
      .accountHolderId(beaconBackupItem.getAccountHolderId())
      .chkCode(beaconBackupItem.getChkCode())
      .coding(beaconBackupItem.getCoding())
      .createdDate(beaconBackupItem.getCreatedDate())
      .lastModifiedDate(beaconBackupItem.getLastModifiedDate())
      .lastServicedDate(beaconBackupItem.getLastServicedDate())
      .svdr(beaconBackupItem.getSvdr())
      .batteryExpiryDate(beaconBackupItem.getBatteryExpiryDate())
      .manufacturer(beaconBackupItem.getManufacturer())
      .manufacturerSerialNumber(beaconBackupItem.getManufacturerSerialNumber())
      .protocol(beaconBackupItem.getProtocol())
      .referenceNumber(beaconBackupItem.getReferenceNumber())
      .build();
  }

  public List<Note> getNonSystemNotesByBeaconId(BeaconId beaconId) {
    return noteRepository
      .findByBeaconId(beaconId)
      .stream()
      .filter((note -> !(note.getFullName().equals("SYSTEM"))))
      .collect(Collectors.toList());
  }
}
