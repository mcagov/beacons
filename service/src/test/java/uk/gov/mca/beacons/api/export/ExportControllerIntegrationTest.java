package uk.gov.mca.beacons.api.export;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.batch.test.JobRepositoryTestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import uk.gov.mca.beacons.api.WebIntegrationTest;
import uk.gov.mca.beacons.api.export.csv.CsvExporter;

public class ExportControllerIntegrationTest extends WebIntegrationTest {

  @Autowired
  private JobRepositoryTestUtils jobRepositoryTestUtils;

  @Autowired
  CsvExporter csvExporter;

  @Nested
  class csvExports {

    @Test
    public void givenACsvExportExists_whenTheUserRequestsIt_thenServeTheFile()
      throws Exception {
      // -- Arrange --
      String accountHolderId_1 = seedAccountHolder();
      seedRegistration(RegistrationUseCase.SINGLE_BEACON, accountHolderId_1);
      seedLegacyBeacon();
      csvExporter.exportBeaconsToCsv();

      // -- Act --
      webTestClient
        .get()
        .uri(Endpoints.Export.value + "/csv")
        .exchange()
        .expectStatus()
        .isOk()
        .expectHeader()
        .contentType(new MediaType("application", "force-download"));

      // -- Teardown --
      jobRepositoryTestUtils.removeJobExecutions();
    }

    @Test
    public void givenTheSpreadsheetExportDoesNotExist_whenTheUserRequestsTheLatestExport_thenReturn503ServiceUnavailable()
      throws Exception {
      // Arrange
      String accountHolderId_1 = seedAccountHolder();
      seedRegistration(RegistrationUseCase.SINGLE_BEACON, accountHolderId_1);
      seedLegacyBeacon();

      // Act
      webTestClient
        .get()
        .uri(Endpoints.Export.value + "/csv")
        .exchange()
        .expectStatus()
        .isEqualTo(HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  @Nested
  class XlsxExports {

    @Test
    public void givenAnXlsxExportExists_whenTheUserRequestsIt_thenServeTheFile()
      throws Exception {
      // -- Arrange --
      String accountHolderId_1 = seedAccountHolder();
      seedRegistration(RegistrationUseCase.SINGLE_BEACON, accountHolderId_1);
      seedLegacyBeacon();
      csvExporter.exportBeaconsToCsv();

      // -- Act --
      webTestClient
        .get()
        .uri(Endpoints.Export.value + "/xlsx")
        .exchange()
        .expectStatus()
        .isOk()
        .expectHeader()
        .contentType(new MediaType("application", "force-download"));

      // -- Teardown --
      jobRepositoryTestUtils.removeJobExecutions();
    }
  }
}
