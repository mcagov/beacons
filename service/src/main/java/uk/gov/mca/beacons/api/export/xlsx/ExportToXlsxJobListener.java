package uk.gov.mca.beacons.api.export.xlsx;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Objects;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.jetbrains.annotations.NotNull;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobExecutionListener;

@Slf4j
public class ExportToXlsxJobListener implements JobExecutionListener {

  private final SXSSFWorkbook workbook;

  ExportToXlsxJobListener(SXSSFWorkbook workbook) {
    this.workbook = workbook;
  }

  @Override
  public void afterJob(JobExecution jobExecution) {
    BatchStatus batchStatus = jobExecution.getStatus();
    if (batchStatus == BatchStatus.COMPLETED) {
      Path destination = Path.of(
        Objects.requireNonNull(
          jobExecution.getJobParameters().getString("destination")
        )
      );
      try {
        OutputStream fileOutputStream = Files.newOutputStream(destination);
        workbook.write(fileOutputStream);
        fileOutputStream.close();
        workbook.dispose();
      } catch (IOException e) {
        log.error(e.getMessage(), e);
      }
    }
  }

  @Override
  public void beforeJob(@NotNull JobExecution jobExecution) {}
}
