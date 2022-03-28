package uk.gov.mca.beacons.api.export;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Date;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.JobParametersInvalidException;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.repository.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException;
import org.springframework.batch.core.repository.JobRestartException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@PreAuthorize("hasAuthority('APPROLE_DATA_EXPORTER')")
public class ExportService {

  private final JobLauncher jobLauncher;
  private final Job exportToSpreadsheetJob;
  private final Path exportDirectory;

  private enum logMessages {
    SPREADSHEET_EXPORT_FAILED,
    NO_EXISTING_BACKUP_FOUND,
  }

  @Autowired
  public ExportService(
    JobLauncher jobLauncher,
    Job exportToSpreadsheetJob,
    @Value("${export.directory}") Path exportDirectory
  ) {
    this.jobLauncher = jobLauncher;
    this.exportToSpreadsheetJob = exportToSpreadsheetJob;
    this.exportDirectory = exportDirectory;
  }

  /**
   * Return the most recently saved backup of beacons data in .csv format
   *
   * If no backup is found, trigger a new backup export and return null
   *
   * @return Resource | null - The latest spreadsheet export, or null if it doesn't exist
   * @throws SpreadsheetExportFailedException if the
   */
  public Path getLatestExcelExport() throws SpreadsheetExportFailedException {
    if (exportIsReady()) {
      return getPathToLatestExport();
    } else {
      log.error(
        "[{}]: The latest spreadsheet export was requested but it was not available",
        logMessages.SPREADSHEET_EXPORT_FAILED
      );
      throw new SpreadsheetExportFailedException();
    }
  }

  /**
   * Synchronously start the exportToSpreadsheetJob using the default JobLauncher.
   *
   * @throws SpreadsheetExportFailedException if the export fails
   */
  public void exportBeaconsToSpreadsheet()
    throws SpreadsheetExportFailedException {
    exportBeaconsToSpreadsheet(jobLauncher);
  }

  private boolean exportIsReady() {
    boolean exportFileExists = Files.exists(getPathToLatestExport());
    if (!exportFileExists) {
      log.warn(
        "[{}]: Expected there to be an existing backup of the data, but couldn't find one",
        logMessages.NO_EXISTING_BACKUP_FOUND
      );
    }

    return exportFileExists;
  }

  private void exportBeaconsToSpreadsheet(JobLauncher jobLauncher)
    throws SpreadsheetExportFailedException {
    try {
      jobLauncher.run(exportToSpreadsheetJob, getExportJobParameters());
    } catch (
      JobInstanceAlreadyCompleteException
      | JobExecutionAlreadyRunningException
      | JobRestartException
      | JobParametersInvalidException e
    ) {
      log.error(
        "[{}]: Tried to launch exportToSpreadsheetJob with jobLauncher {} but failed",
        logMessages.SPREADSHEET_EXPORT_FAILED,
        jobLauncher.getClass()
      );
      throw new SpreadsheetExportFailedException(e);
    }
  }

  private JobParameters getExportJobParameters()
    throws SpreadsheetExportFailedException {
    JobParametersBuilder builder = new JobParametersBuilder();
    builder.addDate("date", new Date());
    builder.addString("destination", getPathToLatestExport().toString());

    return builder.toJobParameters();
  }

  private Path getPathToLatestExport() {
    Path path = exportDirectory.resolve("beacons_data.csv");
    assert Files.exists(path);
    return path;
  }
}
