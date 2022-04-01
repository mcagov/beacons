package uk.gov.mca.beacons.api.export.xlsx;

import java.nio.file.Path;
import java.text.SimpleDateFormat;
import java.time.Clock;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

/**
 * Export beacons data to .xlsx.
 */
@Service
@Slf4j
@PreAuthorize("hasAuthority('APPROLE_DATA_EXPORTER')")
public class XlsxExporter {

  private final Path exportDirectory;
  private final Clock clock;
  private final SimpleDateFormat filenameDatePrefixFormat = new SimpleDateFormat(
    "yyyyMMdd"
  );

  @Autowired
  public XlsxExporter(
    @Value("${export.directory}") Path exportDirectory,
    Clock clock
  ) {
    this.exportDirectory = exportDirectory;
    this.clock = clock;
  }

  public Optional<Path> getMostRecentExport() {
    return null;
  }
}
