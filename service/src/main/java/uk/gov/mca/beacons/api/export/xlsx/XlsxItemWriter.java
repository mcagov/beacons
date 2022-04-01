package uk.gov.mca.beacons.api.export.xlsx;

import java.util.List;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.springframework.batch.item.ItemWriter;
import uk.gov.mca.beacons.api.export.SpreadsheetRow;

public class XlsxItemWriter implements ItemWriter<SpreadsheetRow> {

  private final Sheet sheet;

  XlsxItemWriter(Sheet sheet) {
    this.sheet = sheet;
  }

  @Override
  public void write(List<? extends SpreadsheetRow> list) {
    for (int i = 0; i < list.size(); i++) {
      writeRow(i, list.get(i));
    }
  }

  private void writeRow(int currentRowNumber, SpreadsheetRow data) {
    List<String> values = prepareValues(data);
    Row row = this.sheet.createRow(currentRowNumber);
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
