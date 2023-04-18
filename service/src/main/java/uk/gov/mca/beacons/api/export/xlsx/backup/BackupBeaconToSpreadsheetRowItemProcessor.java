package uk.gov.mca.beacons.api.export.xlsx.backup;

import com.fasterxml.jackson.core.JsonProcessingException;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.beaconuse.mappers.BeaconUseMapper;
import uk.gov.mca.beacons.api.exceptions.ResourceNotFoundException;
import uk.gov.mca.beacons.api.export.mappers.ExportMapper;
import uk.gov.mca.beacons.api.legacybeacon.application.LegacyBeaconService;
import uk.gov.mca.beacons.api.note.domain.Note;
import uk.gov.mca.beacons.api.registration.application.RegistrationReadOnlyService;
import uk.gov.mca.beacons.api.registration.domain.Registration;

@Slf4j
@Component
class BackupBeaconToSpreadsheetRowItemProcessor
  implements ItemProcessor<BeaconBackupItem, BackupSpreadsheetRow> {

  private final RegistrationReadOnlyService registrationService;
  private final LegacyBeaconService legacyBeaconService;
  private ExportMapper exportMapper;

  private final BeaconUseMapper beaconUseMapper;

  private static final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern(
    "dd-MM-yyyy"
  );

  @Autowired
  public BackupBeaconToSpreadsheetRowItemProcessor(
    RegistrationReadOnlyService registrationService,
    LegacyBeaconService legacyBeaconService,
    ExportMapper exportMapper,
    BeaconUseMapper beaconUseMapper
  ) {
    this.registrationService = registrationService;
    this.legacyBeaconService = legacyBeaconService;
    this.exportMapper = exportMapper;
    this.beaconUseMapper = beaconUseMapper;
  }

  @Transactional(
    readOnly = true,
    noRollbackFor = ResourceNotFoundException.class
  )
  @Override
  public BackupSpreadsheetRow process(BeaconBackupItem beaconBackupItem)
    throws JsonProcessingException {
    UUID beaconItemId = beaconBackupItem.getId();

    BeaconId modernBeaconId = new BeaconId(beaconItemId);

    if (beaconBackupItem.getCategory() == BeaconCategory.MODERN) {
      Registration registration = registrationService.getRegistrationFromBeaconBackupItem(
        beaconBackupItem
      );

      log.info(
        "start getNonSystemNotesByBeaconId " +
        beaconItemId +
        OffsetDateTime.now()
      );
      List<Note> nonSystemNotes = registrationService.getNonSystemNotesByBeaconId(
        modernBeaconId
      );
      log.info(
        "end getNonSystemNotesByBeaconId " + beaconItemId + OffsetDateTime.now()
      );

      return new BackupSpreadsheetRow(
        registration,
        nonSystemNotes,
        beaconUseMapper,
        dateFormatter
      );
    } else {
      return new BackupSpreadsheetRow(
        beaconBackupItem,
        exportMapper,
        dateFormatter
      );
    }
  }
}
