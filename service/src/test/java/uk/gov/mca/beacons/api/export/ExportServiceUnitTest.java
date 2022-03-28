package uk.gov.mca.beacons.api.export;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.google.common.jimfs.Jimfs;
import java.io.IOException;
import java.nio.file.FileSystem;
import java.nio.file.Files;
import java.nio.file.Path;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.launch.JobLauncher;

@ExtendWith(MockitoExtension.class)
public class ExportServiceUnitTest {

  @Mock
  JobLauncher jobLauncher;

  @Mock
  Job exportToSpreadsheetJob;

  FileSystem fileSystem = Jimfs.newFileSystem();
  String exportDirectory = "/var/export";
  ExportService exportService;

  @BeforeEach
  public void arrange() throws IOException {
    Path path = fileSystem.getPath(exportDirectory);
    Files.deleteIfExists(path);
    Files.createDirectories(path);

    exportService =
      new ExportService(jobLauncher, exportToSpreadsheetJob, path);
  }

  @Test
  public void whenThereIsNoPreviouslyExportedSpreadsheet_ThenRaiseException()
    throws SpreadsheetExportFailedException {
    assertThrows(
      SpreadsheetExportFailedException.class,
      () -> exportService.getLatestExcelExport()
    );
  }

  @Test
  public void whenThereIsAPreviouslyExportedSpreadsheet_ThenReturnTheExport()
    throws SpreadsheetExportFailedException, IOException {
    assert testExportDirectoryIsEmpty();
    createFile("beacons_data.csv");
    Path previouslyExportedSpreadsheet = getFile("beacons_data.csv");

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
