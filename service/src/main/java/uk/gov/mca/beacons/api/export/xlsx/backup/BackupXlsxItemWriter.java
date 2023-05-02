package uk.gov.mca.beacons.api.export.xlsx.backup;

import java.lang.reflect.InvocationTargetException;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.springframework.batch.item.ItemWriter;
import uk.gov.mca.beacons.api.export.xlsx.BeaconsDataWorkbookRepository;

public class BackupXlsxItemWriter implements ItemWriter<BackupSpreadsheetRow> {

  BeaconsDataWorkbookRepository beaconsDataWorkbookRepository;

  public BackupXlsxItemWriter(
    BeaconsDataWorkbookRepository beaconsDataWorkbookRepository
  ) {
    this.beaconsDataWorkbookRepository = beaconsDataWorkbookRepository;
  }

  @Override
  public void write(List<? extends BackupSpreadsheetRow> backupRows)
    throws NullPointerException {
    Sheet sheet = Objects
      .requireNonNull(
        beaconsDataWorkbookRepository
          .getWorkbook(BeaconsDataWorkbookRepository.OperationType.BACKUP)
          .get()
      )
      .getSheet("Beacons Backup Data");

    // returns -1 if there are no rows;
    int currentRowNum = sheet.getLastRowNum() + 1;

    for (BackupSpreadsheetRow row : backupRows) {
      writeRow(sheet, currentRowNum, row);
      currentRowNum++;
    }
  }

  private void writeRow(
    Sheet sheet,
    int currentRowNumber,
    BackupSpreadsheetRow data
  ) {
    List<String> values = prepareValues(data);
    Row row = sheet.createRow(currentRowNumber);
    for (int i = 0; i < values.size(); i++) {
      writeCell(row, i, values.get(i));
    }
  }

  private List<String> prepareValues(BackupSpreadsheetRow row) {
    return BackupSpreadsheetRow.COLUMN_ATTRIBUTES
      .stream()
      .map(attribute -> {
        try {
          Object property = PropertyUtils.getProperty(row, attribute);
          if (property == null) {
            return "";
          } else {
            return property.toString();
          }
        } catch (
          IllegalAccessException
          | InvocationTargetException
          | NoSuchMethodException e
        ) {
          throw new RuntimeException(e);
        }
      })
      .collect(Collectors.toList());
  }

  private void writeCell(Row row, int currentColumnNumber, String value) {
    Cell cell = row.createCell(currentColumnNumber);
    cell.setCellValue(value);
  }
}
