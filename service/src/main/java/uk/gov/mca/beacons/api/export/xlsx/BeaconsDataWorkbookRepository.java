package uk.gov.mca.beacons.api.export.xlsx;

import java.lang.ref.WeakReference;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.export.SpreadsheetRow;

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

  private static final int WORKBOOK_WINDOW_SIZE = 256;
  private SXSSFWorkbook workbook;

  public BeaconsDataWorkbookRepository() {}

  public WeakReference<SXSSFWorkbook> getWorkbook() {
    if (workbook == null) {
      initialiseWorkbook();
    }

    return new WeakReference<>(workbook);
  }

  public boolean disposeOfWorkbook() {
    boolean success = this.workbook.dispose();
    this.workbook = null;
    return success;
  }

  private void initialiseWorkbook() {
    workbook = new SXSSFWorkbook(WORKBOOK_WINDOW_SIZE);
    Sheet sheet = workbook.createSheet("Beacons Data");
    Row row = sheet.createRow(0);

    int cellNum = 0;
    for (String header : SpreadsheetRow.COLUMN_HEADINGS) {
      row.createCell(cellNum).setCellValue(header);
      cellNum++;
    }
  }
}
