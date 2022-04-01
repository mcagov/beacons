package uk.gov.mca.beacons.api.export;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Clock;
import java.util.Comparator;
import java.util.Date;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import uk.gov.mca.beacons.api.export.csv.ExportToCsvFailedException;

@Service
@Slf4j
@PreAuthorize("hasAuthority('APPROLE_DATA_EXPORTER')")
public class ExportService {

  private final ExportJobManager exportJobManager;
  private final Path exportDirectory;
  private final Clock clock;
  private final SimpleDateFormat filenameDatePrefixFormat = new SimpleDateFormat(
    "yyyyMMdd"
  );

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
   * Return the stored .csv file with the most current date prefix
   *
   * @return Path to the latest spreadsheet export
   * @throws ExportToCsvFailedException if the latest export is unavailable
   */
  public Optional<Path> getMostRecentDailyExport() throws IOException {
    return Files
      .list(exportDirectory)
      .filter(file -> !Files.isDirectory(file))
      .filter(file -> !file.getFileName().endsWith(".csv"))
      .max(
        Comparator.comparing(
          file -> getDate(file.getFileName()),
          Comparator.nullsFirst(Comparator.naturalOrder())
        )
      );
  }

  public void exportBeaconsToSpreadsheet() throws IOException {
    if (todaysExportAlreadyExists()) {
      log.info(
        "ExportService::exportBeaconsToSpreadsheet: export file already exists for today at {}.  Doing nothing...",
        getMostRecentDailyExport()
      );
      return;
    }

    exportJobManager.exportToCsv(getNextExportDestination());
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
    return filenameDatePrefixFormat.format(today);
  }

  private Date getDate(Path filename) {
    try {
      return filenameDatePrefixFormat.parse((filename.toString()));
    } catch (ParseException e) {
      log.warn("Tried to parse a date from {} but failed", filename, e);
      return null;
    }
  }
}
