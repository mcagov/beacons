package uk.gov.mca.beacons.api.export.xlsx;

import java.lang.ref.WeakReference;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.stereotype.Component;

/**
 * This is implemented naively and without any thread safety (i.e. no use of Mutexes or Atomic Booleans) because
 * the jobs that make use of it are not thread safe themselves. Workbook repository instead manages the lifecycle
 * of a single workbook instance and does not make any attempt to prevent handing out multiple references to the
 * workbook.
 */
@Component
public class WorkbookRepository {

  private static final int WORKBOOK_WINDOW_SIZE = 256;
  private SXSSFWorkbook workbook;

  public WorkbookRepository() {}

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
    workbook.createSheet("Beacons Data");
  }
}
