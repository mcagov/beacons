package uk.gov.mca.beacons.api.export;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.batch.test.JobRepositoryTestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import uk.gov.mca.beacons.api.WebIntegrationTest;
import uk.gov.mca.beacons.api.export.xlsx.XlsxExporter;

public class ExportControllerIntegrationTest extends WebIntegrationTest {

  @Autowired
  private JobRepositoryTestUtils jobRepositoryTestUtils;

  @Autowired
  XlsxExporter xlsxExporter;

  @Nested
  class XlsxExports {

    @Test
    public void givenAnXlsxExportExists_whenTheUserRequestsIt_thenServeTheFile()
      throws Exception {
      // -- Arrange --
      String accountHolderId_1 = seedAccountHolder();
      seedRegistration(RegistrationUseCase.SINGLE_BEACON, accountHolderId_1);
      seedLegacyBeacon();
      xlsxExporter.export();

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
