package uk.gov.mca.beacons.api.export;

import java.nio.file.Files;
import java.nio.file.Path;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Clock;
import java.util.Comparator;
import java.util.Date;
import java.util.Optional;
import java.util.stream.Stream;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.export.xlsx.BeaconsDataWorkbookRepository;

/**
 * Creates filenames for exports and parses data from filenames.
 *
 * Encapsulates file naming convention concerns, including date prefixes, protective markings and file extensions.
 */
@Component
@Slf4j
public class ExportFileNamer {

  private Clock clock;
  private final SimpleDateFormat filenameDatePrefixFormat = new SimpleDateFormat(
    "yyyyMMdd"
  );
  private final String protectiveMarking = "Official-Sensitive_Personal";

  public enum FileType {
    COMMA_SEPARATED_VALUE(".csv"),
    EXCEL_SPREADSHEET(".xlsx");

    public final String extension;

    FileType(String extension) {
      this.extension = extension;
    }
  }

  @Autowired
  public ExportFileNamer(Clock clock) {
    this.clock = clock;
  }

  /**
   * Build a filename of fileType from today's date.
   *
   * @param fileType The desired filetype of filename
   * @return String file name using the correct naming convention
   */
  public String constructTodaysExportFilename(
    FileType fileType,
    BeaconsDataWorkbookRepository.OperationType operationType
  ) {
    return (
      todaysDateFilenamePrefix() +
      "-" +
      getFilename(operationType) +
      "-" +
      protectiveMarking +
      fileType.extension
    );
  }

  private String getFilename(
    BeaconsDataWorkbookRepository.OperationType operationType
  ) {
    switch (operationType) {
      case EXPORT:
        return "Beacons_Export_Data";
      case BACKUP:
        return "Beacons_Backup_Data";
      default:
        return "Beacons_Data";
    }
  }

  public boolean isDatedToday(Path exportPath) {
    return exportPath.getFileName().startsWith(todaysDateFilenamePrefix());
  }

  public Date parseDate(Path exportPath) {
    try {
      return filenameDatePrefixFormat.parse(
        (exportPath.getFileName().toString())
      );
    } catch (ParseException e) {
      log.warn("Tried to parse a date from {} but failed", exportPath);
      return null;
    }
  }

  public Optional<Path> mostRecentFile(Stream<Path> files) {
    return files
      .filter(file -> !Files.isDirectory(file))
      .max(
        Comparator.comparing(
          this::parseDate,
          Comparator.nullsFirst(Comparator.naturalOrder())
        )
      );
  }

  private String todaysDateFilenamePrefix() {
    Date today = Date.from(clock.instant());
    return filenameDatePrefixFormat.format(today);
  }
}
