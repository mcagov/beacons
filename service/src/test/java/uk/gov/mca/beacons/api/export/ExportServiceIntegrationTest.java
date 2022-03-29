package uk.gov.mca.beacons.api.export;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.reset;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Clock;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import uk.gov.mca.beacons.api.WebIntegrationTest;

class ExportServiceIntegrationTest extends WebIntegrationTest {

  /**
   * Spring Batch uses the pre-Java 7 "File" abstraction to write to files.  The File abstraction can't deal with
   * alternative file systems, such as one mocked using Jimfs or similar.  This integration test therefore uses the
   * host machine's real filesystem, and performs cleanup in the @AfterAll step.
   */
  static Path exportDirectory;

  @Mock
  Clock clock;

  @Autowired
  ExportJobManager exportJobManager;

  ExportService exportService;

  @BeforeEach
  public void arrange() throws IOException {
    exportDirectory = Files.createTempDirectory("beacons");
    exportDirectory.toFile().deleteOnExit();

    exportService = new ExportService(exportJobManager, exportDirectory, clock);

    reset(clock);
    Mockito.when(clock.instant()).thenReturn(Instant.EPOCH);
  }

  @Test
  public void givenBeaconsAndLegacyBeacons_whenExportIsTriggered_thenSpreadsheetContainsData()
    throws Exception {
    String accountHolderId_1 = seedAccountHolder();
    String accountHolderId_2 = seedAccountHolder();
    String id1 = seedRegistration(
      WebIntegrationTest.RegistrationUseCase.SINGLE_BEACON,
      accountHolderId_1
    );
    String id2 = seedRegistration(
      WebIntegrationTest.RegistrationUseCase.SINGLE_BEACON,
      accountHolderId_2
    );
    String id3 = seedLegacyBeacon();

    exportService.exportBeaconsToSpreadsheet();
    Path export = exportService.getMostRecentDailyExport().orElseThrow();
    List<List<String>> spreadsheet = readCsv(export);

    List<String> headerRow = spreadsheet.get(0);
    List<List<String>> dataRows = spreadsheet.subList(1, spreadsheet.size());
    assertThat(headerRow, hasItems("ID"));
    assertThat(dataRows, hasSize(3));
    assertThat(
      getColumnValuesByHeading(spreadsheet, "ID"),
      containsInAnyOrder(id1, id2, id3)
    );
  }

  private List<List<String>> readCsv(Path csvExport) throws IOException {
    String COMMA_DELIMITER = ",";

    List<List<String>> records = new ArrayList<>();
    BufferedReader br = new BufferedReader(
      new StringReader(Files.readString(csvExport))
    );
    String line;
    while ((line = br.readLine()) != null) {
      String[] values = line.split(COMMA_DELIMITER);
      records.add(Arrays.asList(values));
    }

    return records;
  }

  private List<String> getColumnValuesByHeading(
    List<List<String>> spreadsheet,
    String heading
  ) {
    List<String> headerRow = spreadsheet.get(0);
    int columnIndex = headerRow.indexOf(heading);

    return spreadsheet
      .stream()
      .skip(1)
      .map(row -> row.get(columnIndex))
      .collect(Collectors.toList());
  }
}
