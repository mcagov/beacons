package uk.gov.mca.beacons.api.export;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import com.google.common.jimfs.Jimfs;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.FileSystem;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Clock;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
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
  }

  @Test
  public void whenThereIsNoPreviouslyExportedSpreadsheet_ThenRaiseException()
    throws SpreadsheetExportFailedException, FileNotFoundException {
    when(exportJobManager.getLatestExport())
      .thenThrow(FileNotFoundException.class);

    assertThrows(
      SpreadsheetExportFailedException.class,
      () -> exportService.getLatestExcelExport()
    );
  }

  @Test
  public void whenThereIsAPreviouslyExportedSpreadsheet_ThenReturnTheExport()
    throws SpreadsheetExportFailedException, IOException {
    createFile("beacons_data.csv");
    Path previouslyExportedSpreadsheet = getFile("beacons_data.csv");
    when(exportJobManager.getLatestExport())
      .thenReturn(previouslyExportedSpreadsheet);

    Path actualCsvExport = exportService.getLatestExcelExport();

    assertThat(actualCsvExport, is(previouslyExportedSpreadsheet));
  }

  private boolean testExportDirectoryIsEmpty() throws IOException {
    return Files.list(testExportDirectory()).findFirst().isEmpty();
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
