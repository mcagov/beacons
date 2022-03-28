package uk.gov.mca.beacons.api.export;

import java.io.FileNotFoundException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Date;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobInstance;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.JobParametersInvalidException;
import org.springframework.batch.core.explore.JobExplorer;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.repository.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException;
import org.springframework.batch.core.repository.JobRestartException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;

@Component
@PreAuthorize("hasAuthority('APPROLE_DATA_EXPORTER')")
@Slf4j
public class ExportJobManager {

  private final JobExplorer jobExplorer;
  private final JobLauncher jobLauncher;
  private final Job exportToSpreadsheetJob;

  private enum logMessages {
    SPREADSHEET_EXPORT_FAILED,
  }

  @Autowired
  public ExportJobManager(
    JobExplorer jobExplorer,
    JobLauncher jobLauncher,
    Job exportToSpreadsheetJob
  ) {
    this.jobExplorer = jobExplorer;
    this.jobLauncher = jobLauncher;
    this.exportToSpreadsheetJob = exportToSpreadsheetJob;
  }

  /**
   * Synchronously start the exportToSpreadsheetJob using the default JobLauncher.
   *
   * @throws SpreadsheetExportFailedException if the export fails
   */
  public void exportBeaconsToSpreadsheet(Path destination)
    throws SpreadsheetExportFailedException {
    exportBeaconsToSpreadsheet(jobLauncher, destination);
  }

  /**
   * Get the most recently exported spreadsheet
   *
   * @return Path to the latest spreadsheet
   * @throws FileNotFoundException if no suitable spreadsheet export exists
   */
  public ExportResult getLatestExport() throws FileNotFoundException {
    JobInstance latestExportJobInstance = getLatestExportJobInstance();
    JobExecution latestJobExecution = getLatestJobExecution(
      latestExportJobInstance
    );
    Path destinationOfLatestExport = getExportDestination(latestJobExecution);

    if (Files.notExists(destinationOfLatestExport)) {
      log.error(
        "[{}]: Tried to access latest export at {} but file not found",
        logMessages.SPREADSHEET_EXPORT_FAILED,
        destinationOfLatestExport
      );
      throw new FileNotFoundException();
    }

    return new ExportResult(
      destinationOfLatestExport,
      latestJobExecution.getEndTime()
    );
  }

  private JobInstance getLatestExportJobInstance() {
    JobInstance latestExportJobInstance = jobExplorer.getLastJobInstance(
      exportToSpreadsheetJob.getName()
    );
    if (latestExportJobInstance == null) {
      log.error(
        "[{}]: Tried to get most recent JobInstance for the exportToSpreadsheetJob but failed",
        logMessages.SPREADSHEET_EXPORT_FAILED
      );
      throw new SpreadsheetExportFailedException();
    }

    return latestExportJobInstance;
  }

  private JobExecution getLatestJobExecution(JobInstance jobInstance) {
    JobExecution latestJobExecution = jobExplorer.getLastJobExecution(
      jobInstance
    );

    if (latestJobExecution == null) {
      log.error(
        "[{}]: Tried to get most recent JobExecution for the exportToSpreadsheetJob but failed",
        logMessages.SPREADSHEET_EXPORT_FAILED
      );
      throw new SpreadsheetExportFailedException();
    }

    return latestJobExecution;
  }

  private Path getExportDestination(JobExecution jobExecution) {
    if (jobExecution.getStatus() != BatchStatus.COMPLETED) {
      log.error(
        "[{}]: JobExecution with id {} for the exportToSpreadsheetJob has a status other than COMPLETED: {}",
        logMessages.SPREADSHEET_EXPORT_FAILED,
        jobExecution.getId(),
        jobExecution.getStatus()
      );
      throw new SpreadsheetExportFailedException();
    }

    String destinationParameter = jobExecution
      .getJobParameters()
      .getString("destination");

    if (destinationParameter == null) {
      log.error(
        "[{}]: JobExecution with id {} for the exportToSpreadsheetJob had no \"destination\" parameter.  Only parameters were {}",
        logMessages.SPREADSHEET_EXPORT_FAILED,
        jobExecution.getId(),
        jobExecution.getJobParameters()
      );
      throw new SpreadsheetExportFailedException();
    }

    return Path.of(destinationParameter);
  }

  private void exportBeaconsToSpreadsheet(
    JobLauncher jobLauncher,
    Path destination
  ) throws SpreadsheetExportFailedException {
    try {
      jobLauncher.run(
        exportToSpreadsheetJob,
        getExportJobParameters(destination.toString())
      );
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

  private JobParameters getExportJobParameters(String destination)
    throws SpreadsheetExportFailedException {
    JobParametersBuilder builder = new JobParametersBuilder();
    builder.addDate("date", new Date());
    builder.addString("destination", destination);

    return builder.toJobParameters();
  }
}
