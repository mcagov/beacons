package uk.gov.mca.beacons.api.export.xlsx;

import java.util.List;
import java.util.Objects;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.springframework.batch.item.ItemWriter;
import uk.gov.mca.beacons.api.export.SpreadsheetRow;

public class XlsxItemWriter implements ItemWriter<SpreadsheetRow> {

  WorkbookRepository workbookRepository;

  XlsxItemWriter(WorkbookRepository workbookRepository) {
    this.workbookRepository = workbookRepository;
  }

  @Override
  public void write(List<? extends SpreadsheetRow> list)
    throws NullPointerException {
    Sheet sheet = Objects
      .requireNonNull(workbookRepository.getWorkbook().get())
      .getSheet("Beacons Data");

    // returns -1 if there are no rows;
    int currentRowNum = sheet.getLastRowNum() + 1;

    for (SpreadsheetRow row : list) {
      writeRow(sheet, currentRowNum, row);
      currentRowNum++;
    }
  }

  private void writeRow(
    Sheet sheet,
    int currentRowNumber,
    SpreadsheetRow data
  ) {
    List<String> values = prepareValues(data);
    Row row = sheet.createRow(currentRowNumber);
    for (int i = 0; i < values.size(); i++) {
      writeCell(row, i, values.get(i));
    }
  }

  private List<String> prepareValues(SpreadsheetRow row) {
    return List.of(row.getId().toString(), row.getHexId(), row.getOwnerName());
  }

  private void writeCell(Row row, int currentColumnNumber, String value) {
    Cell cell = row.createCell(currentColumnNumber);
    cell.setCellValue(value);
  }
}
