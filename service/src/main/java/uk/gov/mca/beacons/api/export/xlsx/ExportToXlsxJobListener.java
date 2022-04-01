package uk.gov.mca.beacons.api.export.xlsx;

import java.io.FileOutputStream;
import java.io.IOException;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.jetbrains.annotations.NotNull;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobExecutionListener;
import org.springframework.lang.NonNullApi;

@Slf4j
public class ExportToXlsxJobListener implements JobExecutionListener {

  private final SXSSFWorkbook workbook;
  private final FileOutputStream fileOutputStream;

  ExportToXlsxJobListener(
    SXSSFWorkbook workbook,
    FileOutputStream fileOutputStream
  ) {
    this.workbook = workbook;
    this.fileOutputStream = fileOutputStream;
  }

  @Override
  public void afterJob(JobExecution jobExecution) {
    BatchStatus batchStatus = jobExecution.getStatus();
    if (batchStatus == BatchStatus.COMPLETED) {
      try {
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
