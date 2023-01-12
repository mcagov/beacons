package uk.gov.mca.beacons.api.export.xlsx.backup;

import java.time.format.DateTimeFormatter;
import java.util.List;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwner;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwnerReadOnlyRepository;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUseReadOnlyRepository;
import uk.gov.mca.beacons.api.emergencycontact.domain.EmergencyContact;
import uk.gov.mca.beacons.api.emergencycontact.domain.EmergencyContactReadOnlyRepository;
import uk.gov.mca.beacons.api.export.mappers.ExportMapper;
import uk.gov.mca.beacons.api.note.application.NoteService;
import uk.gov.mca.beacons.api.note.domain.Note;

@Component
class BackupBeaconToSpreadsheetRowItemProcessor
  implements ItemProcessor<Beacon, BackupSpreadsheetRow> {

  private final BeaconOwnerReadOnlyRepository beaconOwnerRepository;
  private final BeaconUseReadOnlyRepository beaconUseRepository;
  private final EmergencyContactReadOnlyRepository emergencyContactRepository;
  private final NoteService noteService;

  private final ExportMapper exportMapper;

  private static final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern(
    "dd-MM-yyyy"
  );

  @Autowired
  public BackupBeaconToSpreadsheetRowItemProcessor(
    BeaconOwnerReadOnlyRepository beaconOwnerRepository,
    BeaconUseReadOnlyRepository beaconUseRepository,
    EmergencyContactReadOnlyRepository emergencyContactRepository,
    NoteService noteService,
    ExportMapper exportMapper
  ) {
    this.beaconOwnerRepository = beaconOwnerRepository;
    this.beaconUseRepository = beaconUseRepository;
    this.emergencyContactRepository = emergencyContactRepository;
    this.noteService = noteService;
    this.exportMapper = exportMapper;
  }

  @Transactional(propagation = Propagation.REQUIRES_NEW, readOnly = true)
  @Override
  public BackupSpreadsheetRow process(Beacon beacon) {
    BeaconId beaconId = beacon.getId();
    BeaconOwner beaconOwner = beaconOwnerRepository
      .findBeaconOwnerByBeaconId(beaconId)
      .orElse(null);
    List<BeaconUse> beaconUses = beaconUseRepository.findBeaconUsesByBeaconId(
      beaconId
    );
    List<EmergencyContact> emergencyContacts = emergencyContactRepository.findEmergencyContactsByBeaconId(
      beaconId
    );
    List<Note> notes = noteService.getNonSystemNotes(beaconId);

    return new BackupSpreadsheetRow(
      beacon,
      beaconOwner,
      beaconUses,
      emergencyContacts,
      notes,
      exportMapper,
      dateFormatter
    );
  }
}
