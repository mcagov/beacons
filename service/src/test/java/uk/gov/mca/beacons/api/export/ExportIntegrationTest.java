package uk.gov.mca.beacons.api.export;


import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import uk.gov.mca.beacons.api.WebIntegrationTest;

public class ExportIntegrationTest extends WebIntegrationTest {

    @Nested
    class ExcelSpreadsheetExport {

        @Test
        public void givenTheNightlyExcelExportCompleted_whenTheUserRequestsTheLatestExcelExport_thenServeTheFile() throws Exception {
            // -- Arrange --
            // Seed testcontainers database with Beacons, LegacyBeacons, AccountHolders etc.
            String accountHolderId_1 = seedAccountHolder();
            seedRegistration(RegistrationUseCase.SINGLE_BEACON, accountHolderId_1);
            seedLegacyBeacon();
            // Trigger Excel export job (do not try and test @Scheduled by mocking System time or anything.  I researched; not worth it)
            // exportService.createSpreadsheet();

            // -- Act --
            // GET /spring-api/export/excel/latest

            // -- Assert --
            // Assert the number of lines in first sheet of Excel workbook == (the number of Beacons + LegacyBeacons in
            // database) + 1 (header row)
        }
    }
}
