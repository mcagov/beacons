package uk.gov.mca.beacons.api.export;

import org.junit.jupiter.api.Test;
import org.springframework.batch.test.JobRepositoryTestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import uk.gov.mca.beacons.api.WebIntegrationTest;

public class ExportControllerIntegrationTest extends WebIntegrationTest {

  @Autowired
  private JobRepositoryTestUtils jobRepositoryTestUtils;

  @Autowired
  ExportService exportService;

  @Test
  public void givenTheNightlyExcelExportCompleted_whenTheUserRequestsTheLatestExcelExport_thenServeTheFile()
    throws Exception {
    // -- Arrange --
    String accountHolderId_1 = seedAccountHolder();
    seedRegistration(RegistrationUseCase.SINGLE_BEACON, accountHolderId_1);
    seedLegacyBeacon();
    exportService.exportBeaconsToSpreadsheet();

    // -- Act --
    webTestClient
      .get()
      .uri(Endpoints.Export.value + "/excel")
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
      .uri(Endpoints.Export.value + "/excel")
      .exchange()
      .expectStatus()
      .isEqualTo(HttpStatus.SERVICE_UNAVAILABLE);
  }
}
