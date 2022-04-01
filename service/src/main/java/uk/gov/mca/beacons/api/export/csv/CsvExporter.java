package uk.gov.mca.beacons.api.export.csv;

import java.io.IOException;
import java.nio.file.Path;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import uk.gov.mca.beacons.api.export.ExportFileNamer;
import uk.gov.mca.beacons.api.export.FileSystemRepository;

/**
 * Export beacons data to .csv.
 */
@Service
@Slf4j
@PreAuthorize("hasAuthority('APPROLE_DATA_EXPORTER')")
public class CsvExporter {

  private final CsvExportJobManager csvExportJobManager;
  private final FileSystemRepository fs;

  private enum logMessages {
    NO_EXISTING_BACKUP_FOUND,
  }

  @Autowired
  public CsvExporter(
    CsvExportJobManager csvExportJobManager,
    FileSystemRepository fs
  ) {
    this.csvExportJobManager = csvExportJobManager;
    this.fs = fs;
  }

  /**
   * Return the path of the most recently exported .csv
   *
   * @return Path to the latest spreadsheet export
   * @throws ExportToCsvFailedException if the latest export is unavailable
   */
  public Optional<Path> getMostRecentCsvExport() throws IOException {
    return fs.findMostRecentExport(
      ExportFileNamer.FileType.COMMA_SEPARATED_VALUE
    );
  }

  /**
   * Export the current state of Beacons and LegacyBeacons to a .csv file for retrieval later.
   *
   * @throws IOException if there is a problem accessing the file system
   */
  public void exportBeaconsToCsv() throws IOException {
    if (fs.todaysExportExists(ExportFileNamer.FileType.COMMA_SEPARATED_VALUE)) {
      log.info(
        "CsvExporter::exportBeaconsToCsv: export file already exists for today at {}.  Doing nothing...",
        getMostRecentCsvExport()
      );
      return;
    }

    csvExportJobManager.exportToCsv(
      fs.getNextExportDestination(
        ExportFileNamer.FileType.COMMA_SEPARATED_VALUE
      )
    );
  }
}
