package uk.gov.mca.beacons.api.export.xlsx;

import java.lang.ref.WeakReference;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.export.xlsx.backup.BackupSpreadsheetRow;

/**
 * Provide a reference to a Workbook whose lifecycle can be managed
 *
 * This class is necessary because the Beans in a Spring Batch job configuration are singleton instances instantiated
 * on application start.
 *
 * We want to write to a new Workbook for each execution of the job so that each job executes with a blank state.  This
 * class provides a WeakReference to a new workbook for use in jobs.
 *
 * @implNote This is implemented naively and without any thread safety (i.e. no use of Mutexes or Atomic Booleans) because
 * the jobs that make use of it are not thread safe themselves. Workbook repository instead manages the lifecycle
 * of a single workbook instance and does not make any attempt to prevent handing out multiple references to the
 * workbook.
 */
@Component
public class BeaconsDataWorkbookRepository {

  public enum OperationType {
    EXPORT,
    BACKUP,
  }

  private static final int WORKBOOK_WINDOW_SIZE = 256;
  private SXSSFWorkbook workbook;

  public BeaconsDataWorkbookRepository() {}

  public WeakReference<SXSSFWorkbook> getWorkbook(OperationType operationType) {
    if (workbook == null) {
      initialiseWorkbook(operationType);
    }

    return new WeakReference<>(workbook);
  }

  public boolean disposeOfWorkbook() {
    boolean success = this.workbook.dispose();
    this.workbook = null;
    return success;
  }

  // todo: refactor to make it DRY
  private void initialiseWorkbook(OperationType operationType) {
    workbook = new SXSSFWorkbook(WORKBOOK_WINDOW_SIZE);

    switch (operationType) {
      case EXPORT:
        SXSSFSheet exportSheet = workbook.createSheet("Beacons Export Data");
        exportSheet.trackAllColumnsForAutoSizing();
        Row exportRow = exportSheet.createRow(0);

        int exportCellNum = 0;
        for (String header : ExportSpreadsheetRow.COLUMN_HEADINGS) {
          exportRow.createCell(exportCellNum).setCellValue(header);
          exportCellNum++;
        }
        break;
      case BACKUP:
        SXSSFSheet backupSheet = workbook.createSheet("Beacons Backup Data");
        backupSheet.trackAllColumnsForAutoSizing();
        Row backupRow = backupSheet.createRow(0);

        int backupCellNum = 0;
        for (String header : BackupSpreadsheetRow.COLUMN_HEADINGS) {
          backupRow.createCell(backupCellNum).setCellValue(header);
          backupCellNum++;
        }
        break;
    }
  }
}
