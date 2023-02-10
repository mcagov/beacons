package uk.gov.mca.beacons.api.export.xlsx.backup;

import com.fasterxml.jackson.core.JsonProcessingException;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mca.beacons.api.accountholder.application.AccountHolderService;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwner;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwnerReadOnlyRepository;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUseReadOnlyRepository;
import uk.gov.mca.beacons.api.beaconuse.mappers.BeaconUseMapper;
import uk.gov.mca.beacons.api.export.mappers.ExportMapper;
import uk.gov.mca.beacons.api.note.application.NoteService;
import uk.gov.mca.beacons.api.note.domain.Note;
import uk.gov.mca.beacons.api.registration.application.RegistrationService;
import uk.gov.mca.beacons.api.registration.domain.Registration;

@Component
class BackupBeaconToSpreadsheetRowItemProcessor
  implements ItemProcessor<BeaconBackupItem, BackupSpreadsheetRow> {

  private final RegistrationService registrationService;
  private final NoteService noteService;
  private final AccountHolderService accountHolderService;

  private final ExportMapper exportMapper;

  private final BeaconUseMapper beaconUseMapper;

  private static final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern(
    "dd-MM-yyyy"
  );

  @Autowired
  public BackupBeaconToSpreadsheetRowItemProcessor(
    RegistrationService registrationService,
    NoteService noteService,
    AccountHolderService accountHolderService,
    ExportMapper exportMapper,
    BeaconUseMapper beaconUseMapper
  ) {
    this.registrationService = registrationService;
    this.noteService = noteService;
    this.accountHolderService = accountHolderService;
    this.exportMapper = exportMapper;
    this.beaconUseMapper = beaconUseMapper;
  }

  @Transactional(propagation = Propagation.REQUIRES_NEW, readOnly = true)
  @Override
  public BackupSpreadsheetRow process(BeaconBackupItem beacon)
    throws JsonProcessingException {
    // is it a modern beacon?
    // if so, grab the registration and notes
    // otherwise we have what we need for legacy beacons
    BeaconId beaconId = beacon.getId();
    Registration registration = registrationService.getByBeaconId(beaconId);

    List<Note> nonSystemNotes = noteService.getNonSystemNotes(beaconId);

    return new BackupSpreadsheetRow(
      registration,
      nonSystemNotes,
      beaconUseMapper,
      dateFormatter
    );
  }
}
