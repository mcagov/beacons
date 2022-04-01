package uk.gov.mca.beacons.api.export;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.nio.file.Path;
import java.util.Optional;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mca.beacons.api.export.csv.CsvExportJobManager;
import uk.gov.mca.beacons.api.export.csv.CsvExporter;
import uk.gov.mca.beacons.api.export.csv.ExportToCsvFailedException;

@ExtendWith(MockitoExtension.class)
public class CsvExporterUnitTest {

  @Mock
  CsvExportJobManager csvExportJobManager;

  @Mock
  FileSystemRepository fileSystemRepository;

  @InjectMocks
  CsvExporter csvExporter;

  @Nested
  class exportBeaconsToSpreadsheet {

    @Test
    public void whenAnExportExistsForToday_thenDontCreateANewOne()
      throws IOException {
      when(
        fileSystemRepository.todaysExportExists(
          any(ExportFileNamer.FileType.class)
        )
      )
        .thenReturn(true);

      csvExporter.exportBeaconsToCsv();

      verify(csvExportJobManager, never()).exportToCsv(any());
    }

    @Test
    public void whenAnExportDoesntExistForToday_thenCreateANewOne()
      throws IOException {
      when(
        fileSystemRepository.todaysExportExists(
          any(ExportFileNamer.FileType.class)
        )
      )
        .thenReturn(false);

      csvExporter.exportBeaconsToCsv();

      verify(csvExportJobManager, times(1)).exportToCsv(any());
    }
  }

  @Nested
  class getMostRecentDailyExport {

    @Test
    public void whenThereIsNoPreviouslyExportedSpreadsheet_thenReturnOptionalOfNull()
      throws ExportToCsvFailedException, IOException {
      // No exports

      Optional<Path> export = csvExporter.getMostRecentCsvExport();

      assert export.isEmpty();
    }

    @Test
    public void whenThereIsAnExportedSpreadsheetForToday_thenReturnTheExport()
      throws ExportToCsvFailedException, IOException {
      Path mostRecentExport = Path.of("/test/todays-export.csv");
      when(
        fileSystemRepository.findMostRecentExport(
          any(ExportFileNamer.FileType.class)
        )
      )
        .thenReturn(Optional.of(mostRecentExport));

      Path actualCsvExport = csvExporter
        .getMostRecentCsvExport()
        .orElseThrow(ExportToCsvFailedException::new);

      assertThat(actualCsvExport, is(mostRecentExport));
    }
  }
}
