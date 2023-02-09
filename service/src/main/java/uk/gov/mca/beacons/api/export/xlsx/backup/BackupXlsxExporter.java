package uk.gov.mca.beacons.api.export.xlsx.backup;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
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

    File mostRecentExport = fileSystemRepository
      .findMostRecentExport(
        ExportFileNamer.FileType.EXCEL_SPREADSHEET,
        "Backup"
      )
      .orElseThrow()
      .toFile();

    Sheet sheet = new XSSFWorkbook(mostRecentExport)
      .getSheet("Beacons Backup Data");

    sheet =
      spreadsheetSorter.sortRowsByBeaconDateLastModifiedDesc(sheet, "Backup");

    // write sheet back to file
    OutputStream fileOutputStream = Files.newOutputStream(
      mostRecentExport.toPath()
    );
    //    XSSFWorkbook workbookFromSortedSheet = (XSSFWorkbook) sheet.getWorkbook();
    //    workbookFromSortedSheet.write(fileOutputStream);
  }
}
