package uk.gov.mca.beacons.api.export.xlsx.backup;

import java.io.IOException;
import java.nio.file.Path;
import java.time.Clock;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import uk.gov.mca.beacons.api.export.ExportFileNamer;
import uk.gov.mca.beacons.api.export.FileSystemRepository;

/**
 * Back up beacons data to .xlsx.
 */
@Service
@Slf4j
public class BackupXlsxExporter {

  private final BackupToXlsxJobManager backupToXlsxJobManager;
  private final FileSystemRepository fileSystemRepository;

  @Autowired
  public BackupXlsxExporter(
    BackupToXlsxJobManager backupToXlsxJobManager,
    FileSystemRepository fileSystemRepository
  ) {
    this.backupToXlsxJobManager = backupToXlsxJobManager;
    this.fileSystemRepository = fileSystemRepository;
    // todo: use config from yml file
    //        this.fileSystemRepository.setExportDirectory(@Value("${backup.directory}");
    this.fileSystemRepository.setExportDirectory(Path.of("/var/backup"));
  }

  public Optional<Path> getMostRecentBackup() throws IOException {
    return fileSystemRepository.findMostRecentExport(
      ExportFileNamer.FileType.EXCEL_SPREADSHEET
    );
  }

  /**
   * Back up the current state of Beacons and LegacyBeacons to a .xlsx file for retrieval later.
   *
   * @throws IOException if there is a problem accessing the file system
   */
  public void backup() throws IOException {
    if (
      fileSystemRepository.todaysExportExists(
        ExportFileNamer.FileType.EXCEL_SPREADSHEET
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
        ExportFileNamer.FileType.EXCEL_SPREADSHEET
      )
    );
  }
  //
  //    public void setExportDirectory(Path exportDirectory) {
  //        this.fileSystemRepository.setExportDirectory(exportDirectory);
  //    }
}
