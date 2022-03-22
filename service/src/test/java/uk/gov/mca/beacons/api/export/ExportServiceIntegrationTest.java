package uk.gov.mca.beacons.api.export;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.hasSize;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.StringReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import uk.gov.mca.beacons.api.WebIntegrationTest;

class ExportServiceIntegrationTest extends WebIntegrationTest {
    private final Path testLocalStorageDirectory;
    private final ExportService exportService;

    @Autowired
    public ExportServiceIntegrationTest(JobLauncher jobLauncher, Job exportToSpreadsheetJob) throws IOException {
        this.testLocalStorageDirectory = Files.createTempDirectory("beacons-export");
        this.exportService = new ExportService(
                jobLauncher,
                exportToSpreadsheetJob,
                this.testLocalStorageDirectory,
                new File("beacons_data.csv"));
    }

    @AfterEach
    void resetFilesystemState() throws IOException {
        FileUtils.cleanDirectory(testLocalStorageDirectory.toFile());
    }

    @Test
    public void givenBeaconsAndLegacyBeacons_whenExportIsTriggered_thenSpreadsheetContainsData() throws Exception {
        String accountHolderId_1 = seedAccountHolder();
        String accountHolderId_2 = seedAccountHolder();
        String id1 = seedRegistration(WebIntegrationTest.RegistrationUseCase.SINGLE_BEACON, accountHolderId_1);
        String id2 = seedRegistration(WebIntegrationTest.RegistrationUseCase.SINGLE_BEACON, accountHolderId_2);
        String id3 = seedLegacyBeacon();

        exportService.exportBeaconsToSpreadsheet();

        List<List<String>> spreadsheet = readCsv(exportService.getLatestExcelExport());

        List<String> headerRow = spreadsheet.get(0);
        List<List<String>> dataRows = spreadsheet.subList(1, spreadsheet.size());
        assertThat(headerRow, containsInAnyOrder("ID", "Hex ID", "Owner name"));
        assertThat(dataRows, hasSize(3));
        assertThat(getColumnValuesByHeading(spreadsheet, "ID"), containsInAnyOrder(id1, id2, id3));
    }

    @Test
    public void givenBeaconsAndLegacyBeacons_whenExportIsTriggered_thenSpreasheetIsOrderedByLastModifiedDate() {
        // TODO Look at the last modified date column and assert on ordering
    }

    private List<List<String>> readCsv(byte[] bytearray) throws IOException {
        String COMMA_DELIMITER = ", ";

        List<List<String>> records = new ArrayList<>();
        BufferedReader br = new BufferedReader(new StringReader(new String(bytearray)));
        String line;
        while ((line = br.readLine()) != null) {
            String[] values = line.split(COMMA_DELIMITER);
            records.add(Arrays.asList(values));
        }

        return records;
    }

    private List<String> getColumnValuesByHeading(List<List<String>> spreadsheet, String heading) {
        List<String> headerRow = spreadsheet.get(0);
        int columnIndex = headerRow.indexOf(heading);

        return spreadsheet.stream().skip(1).map((row) -> row.get(columnIndex)).collect(Collectors.toList());
    }
}