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
   * @return Resource - The latest spreadsheet export
   * @throws SpreadsheetExportFailedException if the
   */
  public Path getLatestExcelExport() throws SpreadsheetExportFailedException {
    try {
      Path latestExport = exportJobManager.getLatestExport();
      assert Files.exists(latestExport);
      return latestExport;
    } catch (FileNotFoundException | AssertionError e) {
      log.error(
        "[{}]: Expected there to be an existing backup of the data, but couldn't find one",
        logMessages.NO_EXISTING_BACKUP_FOUND
      );
      throw new SpreadsheetExportFailedException();
    }
  }

  public void exportBeaconsToSpreadsheet() {
    exportJobManager.exportBeaconsToSpreadsheet(getNextExportDestination());
  }

  private Path getNextExportDestination() {
    Date today = Date.from(clock.instant());
    String prefix = new SimpleDateFormat("yyyyMMdd").format(today);
    String filename = "Beacons_Data";
    String suffix = "Official Sensitive - Personal";
    String extension = ".csv";

    Path destination = exportDirectory.resolve(
      prefix + "-" + filename + "-" + suffix + extension
    );

    assert Files.notExists(destination);

    return destination;
  }
}
