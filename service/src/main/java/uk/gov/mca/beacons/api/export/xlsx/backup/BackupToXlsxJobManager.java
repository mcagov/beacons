package uk.gov.mca.beacons.api.export.xlsx.backup;

import java.nio.file.Path;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.*;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.item.ExecutionContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.export.ExportFailedException;
import uk.gov.mca.beacons.api.export.FileSystemRepository;

/**
 * Initiates export jobs using Spring Batch.
 */
@Component
@Slf4j
public class BackupToXlsxJobManager {

  private final JobLauncher jobLauncher;

  private final Job backupToSpreadsheetJob;

  private enum logMessages {
    SPREADSHEET_EXPORT_FAILED,
  }

  @Autowired
  public BackupToXlsxJobManager(
    JobLauncher jobLauncher,
    Job backupToSpreadsheetJob
  ) {
    this.jobLauncher = jobLauncher;
    this.backupToSpreadsheetJob = backupToSpreadsheetJob;
  }

  /**
   * Synchronously start the backupToSpreadsheetJob using the default JobLauncher.
   *
   * @throws ExportFailedException if the export fails
   */
  public void backup(Path destination) throws ExportFailedException {
    backup(jobLauncher, destination);
  }

  private void backup(JobLauncher jobLauncher, Path destination) { //throws ExportFailedException
    try {
      JobExecution jobExecution = jobLauncher.run(
        backupToSpreadsheetJob,
        getBackupJobParameters(destination.toString())
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
        backupToSpreadsheetJob.getName(),
        logMessages.SPREADSHEET_EXPORT_FAILED,
        jobLauncher.getClass()
      );
      throw new ExportFailedException(e);
    }
  }

  private JobParameters getBackupJobParameters(String destination)
    throws ExportFailedException {
    JobParametersBuilder builder = new JobParametersBuilder();
    builder.addDate("date", new Date());
    builder.addString("destination", destination);

    return builder.toJobParameters();
  }
}
