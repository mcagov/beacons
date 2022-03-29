package uk.gov.mca.beacons.api.export;

import java.io.FileNotFoundException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.SimpleDateFormat;
import java.time.Clock;
import java.util.Date;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@PreAuthorize("hasAuthority('APPROLE_DATA_EXPORTER')")
public class ExportService {

  private final ExportJobManager exportJobManager;
  private final Path exportDirectory;
  private final Clock clock;

  private enum logMessages {
    NO_EXISTING_BACKUP_FOUND,
  }

  @Autowired
  public ExportService(
    ExportJobManager exportJobManager,
    @Value("${export.directory}") Path exportDirectory,
    Clock clock
  ) {
    this.exportJobManager = exportJobManager;
    this.exportDirectory = exportDirectory;
    this.clock = clock;
  }

  /**
   * Return the most recently saved backup of beacons data in .csv format
   *
   * @return Path to the latest spreadsheet export
   * @throws SpreadsheetExportFailedException if the latest export is unavailable
   */
  public Path getPathToLatestExport() throws SpreadsheetExportFailedException {
    try {
      ExportResult latestExport = exportJobManager.getLatestExport();
      return latestExport.getPath();
    } catch (FileNotFoundException e) {
      log.error(
        "[{}]: Expected there to be an existing backup of the data, but couldn't find one",
        logMessages.NO_EXISTING_BACKUP_FOUND
      );
      throw new SpreadsheetExportFailedException();
    }
  }

  public void exportBeaconsToSpreadsheet() {
    if (exportAlreadyPerformedToday()) {
      log.info(
        "ExportService::exportBeaconsToSpreadsheet: export file already exists for today at {}.  Doing nothing...",
        getPathToLatestExport()
      );
      return;
    }

    exportJobManager.exportBeaconsToSpreadsheet(getTodaysExportDestination());
  }

  private boolean exportAlreadyPerformedToday() {
    boolean exportAlreadyPerformedToday = false;

    try {
      ExportResult latestExport = exportJobManager.getLatestExport();

      if (
        latestExport
          .getPath()
          .getFileName()
          .toString()
          .startsWith(todaysDateFilenamePrefix())
      ) {
        exportAlreadyPerformedToday = true;
      }
    } catch (FileNotFoundException e) {
      // If file doesn't exist, export wasn't performed today, so return false
    }

    return exportAlreadyPerformedToday;
  }

  private Path getTodaysExportDestination() {
    Path destination = exportDirectory.resolve(getTodaysExportFilename());

    assert Files.notExists(destination);

    return destination;
  }

  private String getTodaysExportFilename() {
    String filename = "Beacons_Data";
    String suffix = "Official Sensitive - Personal";
    String extension = ".csv";

    return (
      todaysDateFilenamePrefix() + "-" + filename + "-" + suffix + extension
    );
  }

  private String todaysDateFilenamePrefix() {
    Date today = Date.from(clock.instant());
    return new SimpleDateFormat("yyyyMMdd").format(today);
  }
}
