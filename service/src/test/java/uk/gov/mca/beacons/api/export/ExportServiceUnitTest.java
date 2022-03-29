package uk.gov.mca.beacons.api.export;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.startsWith;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.google.common.jimfs.Jimfs;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.FileSystem;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.SimpleDateFormat;
import java.time.Clock;
import java.time.Instant;
import java.util.Date;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

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
  class getLatestExcelExport {

    @Test
    public void whenThereIsNoPreviouslyExportedSpreadsheet_thenRaiseException()
      throws SpreadsheetExportFailedException, FileNotFoundException {
      when(exportJobManager.getLatestExport())
        .thenThrow(FileNotFoundException.class);

      assertThrows(
        SpreadsheetExportFailedException.class,
        () -> exportService.getPathToLatestExport()
      );
    }

    @Test
    public void whenThereIsAnExportedSpreadsheet_thenReturnTheExport()
      throws SpreadsheetExportFailedException, IOException {
      createFile("beacons_data.csv");
      ExportResult previouslyExportedSpreadsheet = new ExportResult(
        getFile("beacons_data.csv"),
        Date.from(clock.instant())
      );
      when(exportJobManager.getLatestExport())
        .thenReturn(previouslyExportedSpreadsheet);

      Path actualCsvExport = exportService.getPathToLatestExport();

      assertThat(actualCsvExport, is(previouslyExportedSpreadsheet));
    }
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

      verify(exportJobManager)
        .exportBeaconsToSpreadsheet(argumentCaptor.capture());
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

      verify(exportJobManager, never()).exportBeaconsToSpreadsheet(any());
    }
  }

  private Path testExportDirectory() {
    return fileSystem.getPath(exportDirectory);
  }

  private void createFile(String filename) throws IOException {
    Path fileToCreate = testExportDirectory().resolve(filename);
    Files.createFile(fileToCreate);
  }

  private Path getFile(String filename) {
    return testExportDirectory().resolve(filename);
  }
}
