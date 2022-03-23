package uk.gov.mca.beacons.api.export;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import uk.gov.mca.beacons.api.WebIntegrationTest;

public class ExportIntegrationTest extends WebIntegrationTest {

  @Autowired
  ExportService exportService;

  @Nested
  class ExcelSpreadsheetExport {

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
        .contentType(MediaType.APPLICATION_OCTET_STREAM);
    }

    @Test
    public void givenTheSpreadsheetExportDoesNotExist_whenTheUserRequestsTheLatestExport_thenStartTheExportJobAndPromptUserToRetry()
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
        .isEqualTo(HttpStatus.SERVICE_UNAVAILABLE)
        .expectHeader()
        .valueEquals(HttpHeaders.RETRY_AFTER, "5");

      pollUntil2xx("/spring-api/export/excel");

      webTestClient
        .get()
        .uri(Endpoints.Export.value + "/excel")
        .exchange()
        .expectStatus()
        .isOk()
        .expectBody();
      // Assert on contents of response?
    }
  }
}
