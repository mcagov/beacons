package uk.gov.mca.beacons.api.export;

import java.io.FileNotFoundException;
import java.io.IOException;
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

  public void exportBeaconsToSpreadsheet() throws IOException {
    if (todaysExportAlreadyExists()) {
      log.info(
        "ExportService::exportBeaconsToSpreadsheet: export file already exists for today at {}.  Doing nothing...",
        getPathToLatestExport()
      );
      return;
    }

    exportJobManager.exportBeaconsToSpreadsheet(getNextExportDestination());
  }

  private boolean todaysExportAlreadyExists() throws IOException {
    return Files
      .list(exportDirectory)
      .filter(file -> !Files.isDirectory(file))
      .map(Path::getFileName)
      .anyMatch(
        filename -> filename.toString().startsWith(todaysDateFilenamePrefix())
      );
  }

  private Path getNextExportDestination() {
    Path destination = exportDirectory.resolve(getNextExportFilename());

    assert Files.notExists(destination);

    return destination;
  }

  private String getNextExportFilename() {
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
