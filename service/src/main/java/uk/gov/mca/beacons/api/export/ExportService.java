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

  public Resource getLatestExcelExport()
    throws IOException, JobInstanceAlreadyCompleteException, JobExecutionAlreadyRunningException, JobParametersInvalidException, JobRestartException {
    if (csvExportFile.exists()) {
      return csvExportFile;
    } else {
      exportBeaconsToSpreadsheetAsync();
      return null;
    }
  }

  public void exportBeaconsToSpreadsheet()
    throws JobInstanceAlreadyCompleteException, JobExecutionAlreadyRunningException, JobParametersInvalidException, JobRestartException, IOException {
    jobLauncher.run(exportToSpreadsheetJob, getExportJobParameters());
  }

  public void exportBeaconsToSpreadsheetAsync()
    throws JobInstanceAlreadyCompleteException, JobExecutionAlreadyRunningException, JobParametersInvalidException, JobRestartException, IOException {
    asyncJobLauncher.run(exportToSpreadsheetJob, getExportJobParameters());
  }

  private JobParameters getExportJobParameters() throws IOException {
    JobParametersBuilder builder = new JobParametersBuilder();
    builder.addDate("date", new Date());
    builder.addString("destination", csvExportFile.getFile().getAbsolutePath());
    return builder.toJobParameters();
  }
}
