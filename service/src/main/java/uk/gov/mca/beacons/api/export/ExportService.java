package uk.gov.mca.beacons.api.export;

import java.io.IOException;
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
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@PreAuthorize("hasAuthority('APPROLE_DATA_EXPORTER')")
public class ExportService {

  private final JobLauncher jobLauncher;
  private final JobLauncher asyncJobLauncher;
  private final Job exportToSpreadsheetJob;
  private final Resource csvExportFile;

  private enum logMessages {
    SPREADSHEET_EXPORT_FAILED,
    NO_EXISTING_BACKUP_FOUND,
  }

  @Autowired
  public ExportService(
    JobLauncher jobLauncher,
    @Qualifier("simpleAsyncJobLauncher") JobLauncher asyncJobLauncher,
    Job exportToSpreadsheetJob,
    @Value("file:${export.directory}/beacons_data.csv") Resource csvExportFile
  ) {
    this.jobLauncher = jobLauncher;
    this.asyncJobLauncher = asyncJobLauncher;
    this.exportToSpreadsheetJob = exportToSpreadsheetJob;
    this.csvExportFile = csvExportFile;
  }

  /**
   * Return the most recently saved backup of beacons data in .csv format
   *
   * If no backup is found, trigger a new backup export and return null
   *
   * @return Resource | null - The latest spreadsheet export, or null if it doesn't exist
   * @throws SpreadsheetExportFailedException if the
   */
  public Resource getLatestExcelExport()
    throws SpreadsheetExportFailedException {
    if (!csvExportFile.exists()) {
      log.warn(
        "[{}]: Expected there to be an existing backup of the data, but couldn't find one",
        logMessages.NO_EXISTING_BACKUP_FOUND
      );
      exportBeaconsToSpreadsheet(asyncJobLauncher);
      return null;
    }

    return csvExportFile;
  }

  /**
   * Synchronously start the exportToSpreadsheetJob using the default JobLauncher.
   *
   * @throws SpreadsheetExportFailedException when the export fails
   */
  public void exportBeaconsToSpreadsheet()
    throws SpreadsheetExportFailedException {
    exportBeaconsToSpreadsheet(jobLauncher);
  }

  /**
   * Use an alternative jobLauncher, such as the simpleAsyncJobLauncher, to launch the exportToSpreadsheetJob
   *
   * @param jobLauncher a Spring Batch JobLauncher used to start the job
   * @throws SpreadsheetExportFailedException when the export fails
   */
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
        "{}: Tried to launch exportToSpreadsheetJob with jobLauncher {} but failed",
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

    try {
      builder.addString(
        "destination",
        csvExportFile.getFile().getAbsolutePath()
      );
    } catch (IOException e) {
      log.error(
        "{}: Tried to access file {} but failed",
        logMessages.SPREADSHEET_EXPORT_FAILED,
        csvExportFile.getDescription()
      );
      throw new SpreadsheetExportFailedException(e);
    }

    return builder.toJobParameters();
  }
}
