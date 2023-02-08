package uk.gov.mca.beacons.api.export.xlsx.backup;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Objects;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.jetbrains.annotations.NotNull;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobExecutionListener;
import uk.gov.mca.beacons.api.export.xlsx.BeaconsDataWorkbookRepository;
import uk.gov.mca.beacons.api.export.xlsx.XlsxSpreadsheetSorter;

@Slf4j
public class BackupToXlsxJobListener implements JobExecutionListener {

  private final BeaconsDataWorkbookRepository beaconsDataWorkbookRepository;
  private final XlsxSpreadsheetSorter spreadsheetSorter;

  BackupToXlsxJobListener(
    BeaconsDataWorkbookRepository beaconsDataWorkbookRepository,
    XlsxSpreadsheetSorter spreadsheetSorter
  ) {
    this.beaconsDataWorkbookRepository = beaconsDataWorkbookRepository;
    this.spreadsheetSorter = spreadsheetSorter;
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
            .getWorkbook(BeaconsDataWorkbookRepository.OperationType.BACKUP)
            .get()
        );

        SXSSFSheet sheet = spreadsheetSorter.sortRowsByBeaconDateLastModifiedDesc(
          workbook.getSheet("Beacons Backup Data"),
          "Backup"
        );

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
      } catch (InvalidFormatException e) {
        log.error(e.getMessage(), e);
      }
    }
  }

  @Override
  public void beforeJob(@NotNull JobExecution jobExecution) {}
}
