package uk.gov.mca.beacons.api.export.xlsx.backup;

import java.io.IOException;
import java.nio.file.Path;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uk.gov.mca.beacons.api.export.ExportFileNamer;
import uk.gov.mca.beacons.api.export.FileSystemRepository;
import uk.gov.mca.beacons.api.export.xlsx.BeaconsDataWorkbookRepository;
import uk.gov.mca.beacons.api.export.xlsx.XlsxSpreadsheetSorter;

/**
 * Back up beacons data to .xlsx.
 */
@Service
@Slf4j
public class BackupXlsxExporter {

  private final BackupToXlsxJobManager backupToXlsxJobManager;
  private final FileSystemRepository fileSystemRepository;

  private final XlsxSpreadsheetSorter spreadsheetSorter;

  @Autowired
  public BackupXlsxExporter(
    BackupToXlsxJobManager backupToXlsxJobManager,
    FileSystemRepository fileSystemRepository,
    XlsxSpreadsheetSorter spreadsheetSorter
  ) {
    this.backupToXlsxJobManager = backupToXlsxJobManager;
    this.fileSystemRepository = fileSystemRepository;
    this.spreadsheetSorter = spreadsheetSorter;
  }

  public Optional<Path> getMostRecentBackup() throws IOException {
    var file = fileSystemRepository.findMostRecentExport(
      ExportFileNamer.FileType.EXCEL_SPREADSHEET,
      "Backup"
    );
    return file;
  }

  /**
   * Back up the current state of Beacons and LegacyBeacons to a .xlsx file for retrieval later.
   *
   * @throws IOException if there is a problem accessing the file system
   */
  public void backup() throws IOException, InvalidFormatException {
    if (
      fileSystemRepository.todaysExportExists(
        ExportFileNamer.FileType.EXCEL_SPREADSHEET,
        "Backup"
      )
    ) {
      log.info(
        "BackupExporter::backupBeaconsToCsv: backup file already exists for today at {}.  Doing nothing...",
        getMostRecentBackup()
      );
      return;
    }

    backupToXlsxJobManager.backup(
      fileSystemRepository.getNextExportDestination(
        ExportFileNamer.FileType.EXCEL_SPREADSHEET,
        BeaconsDataWorkbookRepository.OperationType.BACKUP
      )
    );

    spreadsheetSorter.sortRowsByBeaconDateLastModifiedDesc("Backup");
  }
}
