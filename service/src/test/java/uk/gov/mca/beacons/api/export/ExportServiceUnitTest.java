package uk.gov.mca.beacons.api.export;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.startsWith;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.google.common.jimfs.Jimfs;
import java.io.IOException;
import java.nio.file.FileSystem;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.SimpleDateFormat;
import java.time.Clock;
import java.time.Instant;
import java.time.Period;
import java.util.Date;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mca.beacons.api.export.csv.ExportToCsvFailedException;

@ExtendWith(MockitoExtension.class)
public class ExportServiceUnitTest {

  @Mock
  ExportJobManager exportJobManager;

  @Mock
  Clock clock;

  FileSystem fileSystem = Jimfs.newFileSystem();
  String exportDirectory = "/var/export";
  ExportService exportService;

  @BeforeEach
  public void arrange() throws IOException {
    Path path = fileSystem.getPath(exportDirectory);
    Files.deleteIfExists(path);
    Files.createDirectories(path);

    exportService = new ExportService(exportJobManager, path, clock);

    reset(exportJobManager);
    reset(clock);
  }

  @Nested
  class exportBeaconsToSpreadsheet {

    @Test
    public void prefixWithTodaysDate() throws IOException {
      when(clock.instant()).thenReturn(Instant.EPOCH);
      String yyyyMMdd = new SimpleDateFormat("yyyyMMdd")
        .format(Date.from(Instant.EPOCH));
      ArgumentCaptor<Path> argumentCaptor = ArgumentCaptor.forClass(Path.class);

      exportService.exportBeaconsToSpreadsheet();

      verify(exportJobManager).exportToCsv(argumentCaptor.capture());
      String filename = argumentCaptor.getValue().getFileName().toString();
      assertThat(filename, startsWith(yyyyMMdd));
    }

    @Test
    public void whenAnExportExistsForToday_thenDontCreateANewOne()
      throws IOException {
      when(clock.instant()).thenReturn(Instant.EPOCH);
      String yyyyMMdd = new SimpleDateFormat("yyyyMMdd")
        .format(Date.from(Instant.EPOCH));
      createFile(yyyyMMdd + "-rest_of_filename_doesnt_matter.csv");

      exportService.exportBeaconsToSpreadsheet();

      verify(exportJobManager, never()).exportToCsv(any());
    }

    @Test
    public void whenAnExportDoesntExistForToday_thenDoCreateANewOne()
      throws IOException {
      when(clock.instant()).thenReturn(Instant.EPOCH);
      String yesterdayYyyyMMdd = new SimpleDateFormat("yyyyMMdd")
        .format(Date.from(Instant.EPOCH.minus(Period.ofDays(1))));
      createFile(yesterdayYyyyMMdd + "-yesterdays-export.csv");

      exportService.exportBeaconsToSpreadsheet();

      verify(exportJobManager, times(1)).exportToCsv(any());
    }
  }

  @Nested
  class getMostRecentDailyExport {

    @Test
    public void whenThereIsNoPreviouslyExportedSpreadsheet_thenReturnOptionalOfNull()
      throws ExportToCsvFailedException, IOException {
      // No exports

      Optional<Path> export = exportService.getMostRecentDailyExport();

      assert export.isEmpty();
    }

    @Test
    public void whenThereIsAnExportedSpreadsheetForToday_thenReturnTheExport()
      throws ExportToCsvFailedException, IOException {
      String todayYyyyMMdd = new SimpleDateFormat("yyyyMMdd")
        .format(Date.from(Instant.EPOCH));
      Path todaysExport = createFile(
        todayYyyyMMdd + "-only-date-prefix-matters.csv"
      )
        .getFileName();

      Path actualCsvExport = exportService
        .getMostRecentDailyExport()
        .orElseThrow(ExportToCsvFailedException::new)
        .getFileName();

      assertThat(actualCsvExport, is(todaysExport));
    }
  }

  private Path testExportDirectory() {
    return fileSystem.getPath(exportDirectory);
  }

  private Path createFile(String filename) throws IOException {
    Path fileToCreate = testExportDirectory().resolve(filename);
    Files.createFile(fileToCreate);
    return fileToCreate;
  }

  private Path getFile(String filename) {
    return testExportDirectory().resolve(filename);
  }
}
