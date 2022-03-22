package uk.gov.mca.beacons.api.export;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameter;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersInvalidException;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.repository.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException;
import org.springframework.batch.core.repository.JobRestartException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ExportService {
    private final Path localStorageDirectory;
    private final File spreadsheetExportFilename;
    private final JobLauncher jobLauncher;
    private final Job exportToSpreadsheetJob;

    @Autowired
    public ExportService(
            JobLauncher jobLauncher,
            Job exportToSpreadsheetJob,
            @Value("/tmp/beacons/export") Path localStorageDirectory,
            @Value("beacons_data.csv") File spreadsheetExportFilename) {
        this.jobLauncher = jobLauncher;
        this.exportToSpreadsheetJob = exportToSpreadsheetJob;
        this.localStorageDirectory = localStorageDirectory;
        this.spreadsheetExportFilename = spreadsheetExportFilename;
    }

    public byte[] getLatestExcelExport() throws IOException {
        return Files.readAllBytes(getPathToSpreadsheetExport());
    }

    public void exportBeaconsToSpreadsheet() throws JobInstanceAlreadyCompleteException, JobExecutionAlreadyRunningException, JobParametersInvalidException, JobRestartException {
        jobLauncher.run(exportToSpreadsheetJob, new JobParameters(
                Map.of("destination", new JobParameter(String.valueOf(getPathToSpreadsheetExport())))
        ));
    }

    private Path getPathToSpreadsheetExport() {
        return localStorageDirectory.resolve(spreadsheetExportFilename.getName());
    }
}
