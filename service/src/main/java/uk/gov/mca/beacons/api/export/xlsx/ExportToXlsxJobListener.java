package uk.gov.mca.beacons.api.export.xlsx;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Objects;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.jetbrains.annotations.NotNull;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobExecutionListener;

@Slf4j
public class ExportToXlsxJobListener implements JobExecutionListener {

  private final BeaconsDataWorkbookRepository beaconsDataWorkbookRepository;

  ExportToXlsxJobListener(
    BeaconsDataWorkbookRepository beaconsDataWorkbookRepository
  ) {
    this.beaconsDataWorkbookRepository = beaconsDataWorkbookRepository;
  }

  @Override
  public void afterJob(JobExecution jobExecution) throws NullPointerException {
    BatchStatus batchStatus = jobExecution.getStatus();
    if (batchStatus == BatchStatus.COMPLETED) {
      Path destination = Path.of(
        Objects.requireNonNull(
          jobExecution.getJobParameters().getString("destination")
        )
      );
      try {
        OutputStream fileOutputStream = Files.newOutputStream(destination);
        SXSSFWorkbook workbook = Objects.requireNonNull(
          beaconsDataWorkbookRepository
            .getWorkbook(BeaconsDataWorkbookRepository.OperationType.EXPORT)
            .get()
        );

        SXSSFSheet sheet = workbook.getSheet("Beacons Export Data");

        for (Integer i : sheet.getTrackedColumnsForAutoSizing()) {
          sheet.autoSizeColumn(i);
        }

        workbook.write(fileOutputStream);

        fileOutputStream.close();
        boolean success = beaconsDataWorkbookRepository.disposeOfWorkbook();

        if (success) {
          log.info("Successfully disposed of workbook");
        } else {
          log.error("Failed to dispose of workbook");
        }
      } catch (IOException e) {
        log.error(e.getMessage(), e);
      }
    }
  }

  @Override
  public void beforeJob(@NotNull JobExecution jobExecution) {}
}
