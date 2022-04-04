package uk.gov.mca.beacons.api.export.xlsx;

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
 * Export beacons data to .xlsx.
 */
@Service
@Slf4j
@PreAuthorize("hasAuthority('APPROLE_DATA_EXPORTER')")
public class XlsxExporter {

  private final XlsxExportJobManager xlsxExportJobManager;
  private final FileSystemRepository fs;

  @Autowired
  public XlsxExporter(
    XlsxExportJobManager xlsxExportJobManager,
    FileSystemRepository fs
  ) {
    this.xlsxExportJobManager = xlsxExportJobManager;
    this.fs = fs;
  }

  public Optional<Path> getMostRecentExport() throws IOException {
    return fs.findMostRecentExport(ExportFileNamer.FileType.EXCEL_SPREADSHEET);
  }

  /**
   * Export the current state of Beacons and LegacyBeacons to a .xlsx file for retrieval later.
   *
   * @throws IOException if there is a problem accessing the file system
   */
  public void export() throws IOException {
    if (fs.todaysExportExists(ExportFileNamer.FileType.EXCEL_SPREADSHEET)) {
      log.info(
        "CsvExporter::exportBeaconsToCsv: export file already exists for today at {}.  Doing nothing...",
        getMostRecentExport()
      );
      return;
    }

    xlsxExportJobManager.export(
      fs.getNextExportDestination(ExportFileNamer.FileType.EXCEL_SPREADSHEET)
    );
  }
}
