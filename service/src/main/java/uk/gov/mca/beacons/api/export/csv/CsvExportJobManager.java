package uk.gov.mca.beacons.api.export.csv;

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
import uk.gov.mca.beacons.api.export.ExportFailedException;

/**
 * Initiates export jobs using Spring Batch.
 *
 * Encapsulates Spring Batch concerns.
 */
@Component
@PreAuthorize("hasAuthority('APPROLE_DATA_EXPORTER')")
@Slf4j
public class CsvExportJobManager {

  private final JobLauncher jobLauncher;
  private final Job exportToCsvJob;

  private enum logMessages {
    SPREADSHEET_EXPORT_FAILED,
  }

  @Autowired
  public CsvExportJobManager(JobLauncher jobLauncher, Job exportToCsvJob) {
    this.jobLauncher = jobLauncher;
    this.exportToCsvJob = exportToCsvJob;
  }

  /**
   * Synchronously start the exportToCsvJob using the default JobLauncher.
   *
   * @throws ExportFailedException if the export fails
   */
  public void exportToCsv(Path destination) throws ExportFailedException {
    exportToCsv(jobLauncher, destination);
  }

  private void exportToCsv(JobLauncher jobLauncher, Path destination)
    throws ExportFailedException {
    try {
      JobExecution jobExecution = jobLauncher.run(
        exportToCsvJob,
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
        "[{}]: Tried to launch {} with jobLauncher {} but failed",
        exportToCsvJob.getName(),
        logMessages.SPREADSHEET_EXPORT_FAILED,
        jobLauncher.getClass()
      );
      throw new ExportFailedException(e);
    }
  }

  private JobParameters getExportJobParameters(String destination)
    throws ExportFailedException {
    JobParametersBuilder builder = new JobParametersBuilder();
    builder.addDate("date", new Date());
    builder.addString("destination", destination);

    return builder.toJobParameters();
  }
}
