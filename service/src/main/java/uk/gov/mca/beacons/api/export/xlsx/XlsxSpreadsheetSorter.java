package uk.gov.mca.beacons.api.export.xlsx;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.nio.file.Path;
import java.util.*;
import java.util.stream.Collectors;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.util.CellReference;
import org.apache.poi.ss.util.CellUtil;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.export.ExportFileNamer;
import uk.gov.mca.beacons.api.export.FileSystemRepository;

@Component
public class XlsxSpreadsheetSorter {

  FileSystemRepository fileSystemRepository;

  @Autowired
  public XlsxSpreadsheetSorter(FileSystemRepository fileSystemRepository) {
    this.fileSystemRepository = fileSystemRepository;
  }

  public void sortRowsByBeaconDateLastModifiedDesc(String operationName)
    throws IOException, InvalidFormatException {
    File mostRecentExport = fileSystemRepository
      .findMostRecentExport(
        ExportFileNamer.FileType.EXCEL_SPREADSHEET,
        operationName
      )
      .orElseThrow()
      .toFile();

    Sheet sheet = new XSSFWorkbook(mostRecentExport)
      .getSheet("Beacons Backup Data");

    Map<Integer, String> rowsByLastModifiedDate = new HashMap<Integer, String>();

    // returns -1 if there are no rows;
    // skips row 0 which is header row
    int currentRowNum = sheet.getFirstRowNum() + 1;
    Row headerRow = sheet.getRow(0);

    // do I need to change each row back into a BackupSpreadsheetRow?

    int indexOfLastModifiedDateCol = CellReference.convertColStringToIndex(
      "Last modified date"
    );

    for (Row row : sheet) {
      Cell lastModifiedDateCellForCurrentRow = CellUtil.getCell(
        row,
        indexOfLastModifiedDateCol
      );
      rowsByLastModifiedDate.put(
        row.getRowNum(),
        lastModifiedDateCellForCurrentRow.getStringCellValue()
      );
    }
  }

  private void writeRow(
    Sheet sheet,
    int currentRowNumber,
    ExportSpreadsheetRow data
  ) {
    List<String> values = prepareValues(data);
    Row row = sheet.createRow(currentRowNumber);
    for (int i = 0; i < values.size(); i++) {
      writeCell(row, i, values.get(i));
    }
  }

  private List<String> prepareValues(ExportSpreadsheetRow row) {
    return ExportSpreadsheetRow.COLUMN_ATTRIBUTES
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
