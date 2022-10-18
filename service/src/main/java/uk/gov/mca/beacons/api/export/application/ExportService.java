package uk.gov.mca.beacons.api.export.application;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import org.aspectj.apache.bcel.classfile.Module;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mca.beacons.api.accountholder.application.AccountHolderService;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderId;
import uk.gov.mca.beacons.api.beacon.application.BeaconService;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.beaconowner.application.BeaconOwnerService;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwner;
import uk.gov.mca.beacons.api.beaconuse.application.BeaconUseService;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.emergencycontact.application.EmergencyContactService;
import uk.gov.mca.beacons.api.emergencycontact.domain.EmergencyContact;
import uk.gov.mca.beacons.api.exceptions.ResourceNotFoundException;
import uk.gov.mca.beacons.api.export.mappers.ExportMapper;
import uk.gov.mca.beacons.api.export.rest.BeaconExportDTO;
import uk.gov.mca.beacons.api.export.rest.LabelDTO;
import uk.gov.mca.beacons.api.legacybeacon.application.LegacyBeaconService;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeaconId;
import uk.gov.mca.beacons.api.note.application.NoteService;
import uk.gov.mca.beacons.api.registration.application.RegistrationService;
import uk.gov.mca.beacons.api.registration.domain.Registration;
import uk.gov.mca.beacons.api.registration.rest.DeleteRegistrationDTO;

@Transactional
@Service("ExportService")
public class ExportService {

  private final BeaconService beaconService;
  private final RegistrationService registrationService;
  private final LegacyBeaconService legacyBeaconService;
  private final ExportMapper exportMapper;
  private final NoteService noteService;

  @Autowired
  public ExportService(
    BeaconService beaconService,
    RegistrationService registrationService,
    LegacyBeaconService legacyBeaconService,
    ExportMapper exportMapper,
    NoteService ns
  ) {
    this.beaconService = beaconService;
    this.registrationService = registrationService;
    this.legacyBeaconService = legacyBeaconService;
    this.exportMapper = exportMapper;
    this.noteService = ns;
  }

  @Transactional(propagation = Propagation.REQUIRES_NEW, readOnly = true)
  public List<BeaconExportDTO> getAll() {
    List<BeaconExportDTO> beacons = new ArrayList<>();
    beacons.addAll(
      beaconService
        .findAll()
        .stream()
        .map(b -> exportMapper.toBeaconExportDTO(b, null))
        .collect(Collectors.toList())
    );
    beacons.addAll(
      legacyBeaconService
        .findAll()
        .stream()
        .map(lb -> exportMapper.toLegacyBeaconExportDTO(lb))
        .collect(Collectors.toList())
    );
    return beacons;
  }

  public BeaconExportDTO getBeaconExportDTO(
    UUID rawBeaconId,
    String noteGeneratedType
  ) {
    BeaconId beaconId = new BeaconId(rawBeaconId);

    try {
      Registration registration = registrationService.getByBeaconId(beaconId);
      BeaconExportDTO data = exportMapper.toBeaconExportDTO(
        registration,
        noteService.getNonSystemNotes(beaconId)
      );

      if (noteGeneratedType != null) {
        //Only create note for modern for now.
        noteService.createSystemNote(
          beaconId,
          noteGeneratedType + " Generated"
        );
      }
      return data;
    } catch (ResourceNotFoundException ex) {
      LegacyBeacon legacyBeacon = legacyBeaconService
        .findById(new LegacyBeaconId(rawBeaconId))
        .orElse(null);
      if (legacyBeacon == null) {
        return null;
      }
      return exportMapper.toLegacyBeaconExportDTO(legacyBeacon);
    }
  }

  public LabelDTO getLabelDTO(UUID rawBeaconId) {
    BeaconId beaconId = new BeaconId(rawBeaconId);

    try {
      Registration registration = registrationService.getByBeaconId(beaconId);
      LabelDTO data = exportMapper.toLabelDTO(registration);

      //Only create note for modern for now.
      noteService.createSystemNote(beaconId, "Label Generated");
      return data;
    } catch (ResourceNotFoundException ex) {
      LegacyBeacon legacyBeacon = legacyBeaconService
        .findById(new LegacyBeaconId(rawBeaconId))
        .orElse(null);

      if (legacyBeacon == null) {
        return null;
      }
      return exportMapper.toLegacyLabelDTO(legacyBeacon);
    }
  }
}
