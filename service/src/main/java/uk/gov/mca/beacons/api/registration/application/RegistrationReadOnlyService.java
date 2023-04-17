package uk.gov.mca.beacons.api.registration.application;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.beacon.domain.BeaconReadOnlyRepository;
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
  private final BeaconReadOnlyRepository beaconRepository;
  private final EmergencyContactReadOnlyRepository emergencyContactRepository;

  private final NoteReadOnlyRepository noteRepository;

  @Autowired
  public RegistrationReadOnlyService(
    BeaconReadOnlyRepository beaconRepository,
    BeaconOwnerReadOnlyRepository beaconOwnerRepository,
    BeaconUseReadOnlyRepository beaconUseRepository,
    EmergencyContactReadOnlyRepository emergencyContactRepository,
    NoteReadOnlyRepository noteRepository
  ) {
    this.beaconOwnerRepository = beaconOwnerRepository;
    this.beaconUseRepository = beaconUseRepository;
    this.beaconRepository = beaconRepository;
    this.emergencyContactRepository = emergencyContactRepository;
    this.noteRepository = noteRepository;
  }

  public List<Registration> getByBeaconIds(List<BeaconId> beaconIds) {
    List<Registration> registrations = beaconIds
      .stream()
      .map(id -> getByBeaconId(id))
      .collect(Collectors.toList());

    return registrations;
  }

  public Registration getByBeaconId(BeaconId beaconId) {
    Beacon beacon = beaconRepository.findById(beaconId).orElse(null);

    if (beacon == null) {
      return null;
    }

    BeaconOwner beaconOwner = beaconOwnerRepository
      .findBeaconOwnerByBeaconId(beaconId)
      .orElse(null);
    List<BeaconUse> beaconUses = beaconUseRepository.findBeaconUsesByBeaconId(
      beaconId
    );
    List<EmergencyContact> emergencyContacts = emergencyContactRepository.findEmergencyContactsByBeaconId(
      beaconId
    );

    return Registration
      .builder()
      .beacon(beacon)
      .beaconOwner(beaconOwner)
      .beaconUses(beaconUses)
      .emergencyContacts(emergencyContacts)
      .build();
  }

  public Registration getRegistrationFromBeaconBackupItem(
    BeaconBackupItem beaconBackupItem
  ) {
    Registration registration = Registration.builder().build();
    registration =
      hydrateBeaconFromBeaconBackupItem(registration, beaconBackupItem);
    BeaconId beaconId = registration.getBeacon().getId();

    BeaconOwner beaconOwner = beaconOwnerRepository
      .findBeaconOwnerByBeaconId(beaconId)
      .orElse(null);
    List<BeaconUse> beaconUses = beaconUseRepository.findBeaconUsesByBeaconId(
      beaconId
    );
    List<EmergencyContact> emergencyContacts = emergencyContactRepository.findEmergencyContactsByBeaconId(
      beaconId
    );

    registration.setBeaconOwner(beaconOwner);
    registration.setBeaconUses(beaconUses);
    registration.setEmergencyContacts(emergencyContacts);

    return registration;
  }

  private Registration hydrateBeaconFromBeaconBackupItem(
    Registration registration,
    BeaconBackupItem beaconBackupItem
  ) {
    Beacon beacon = new Beacon();
    beacon.setId(new BeaconId(beaconBackupItem.getId()));
    beacon.setHexId(beaconBackupItem.getHexId());
    beacon.setBeaconType(beaconBackupItem.getBeaconType());
    beacon.setBeaconStatus(
      BeaconStatus.valueOf(beaconBackupItem.getBeaconStatus())
    );
    beacon.setCsta(beaconBackupItem.getCsta());
    beacon.setModel(beaconBackupItem.getModel());
    beacon.setMti(beaconBackupItem.getMti());
    beacon.setAccountHolderId(beaconBackupItem.getAccountHolderId());
    beacon.setChkCode(beaconBackupItem.getChkCode());
    beacon.setCoding(beaconBackupItem.getCoding());
    beacon.setCreatedDate(beaconBackupItem.getCreatedDate());
    beacon.setLastModifiedDate(beaconBackupItem.getLastModifiedDate());
    beacon.setLastServicedDate(beaconBackupItem.getLastServicedDate());
    beacon.setSvdr(beaconBackupItem.getSvdr());
    beacon.setBatteryExpiryDate(beaconBackupItem.getBatteryExpiryDate());
    beacon.setManufacturer(beaconBackupItem.getManufacturer());
    beacon.setManufacturerSerialNumber(
      beaconBackupItem.getManufacturerSerialNumber()
    );
    beacon.setProtocol(beaconBackupItem.getProtocol());
    beacon.setReferenceNumber(beaconBackupItem.getReferenceNumber());

    registration.setBeacon(beacon);

    return registration;
  }

  public List<Note> getNonSystemNotesByBeaconId(BeaconId beaconId) {
    return noteRepository
      .findByBeaconId(beaconId)
      .stream()
      .filter((note -> !(note.getFullName().equals("SYSTEM"))))
      .collect(Collectors.toList());
  }
}
