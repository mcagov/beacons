package uk.gov.mca.beacons.api.export;

import java.nio.file.Path;
import java.util.Date;
import java.util.Objects;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;

@Component
@PreAuthorize("hasAuthority('APPROLE_DATA_EXPORTER')")
@Slf4j
public class ExportJobManager {

  private final JobLauncher jobLauncher;
  private final Job exportToSpreadsheetJob;

  private enum logMessages {
    SPREADSHEET_EXPORT_FAILED,
  }

  @Autowired
  public ExportJobManager(JobLauncher jobLauncher, Job exportToSpreadsheetJob) {
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

  private void exportBeaconsToSpreadsheet(
    JobLauncher jobLauncher,
    Path destination
  ) throws SpreadsheetExportFailedException {
    try {
      JobExecution jobExecution = jobLauncher.run(
        exportToSpreadsheetJob,
        getExportJobParameters(destination.toString())
      );
      BatchStatus jobExecutionStatus = jobExecution.getStatus();
      if (!Objects.equals(jobExecutionStatus, BatchStatus.COMPLETED)) {
        throw new Exception(
          "JobExecution failed: BatchStatus was " + jobExecutionStatus
        );
      }
    } catch (Exception e) {
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
