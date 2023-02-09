package uk.gov.mca.beacons.api.export.xlsx;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.*;
import java.util.stream.Collectors;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.compress.utils.Lists;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellReference;
import org.apache.poi.ss.util.CellUtil;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.export.ExportFileNamer;
import uk.gov.mca.beacons.api.export.FileSystemRepository;

@Component
public class XlsxSpreadsheetSorter {

  FileSystemRepository fileSystemRepository;
  DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern(
    "dd-MM-yyyy"
  );

  @Autowired
  public XlsxSpreadsheetSorter(FileSystemRepository fileSystemRepository) {
    this.fileSystemRepository = fileSystemRepository;
  }

  //  public Sheet sortUsingSpire() {
  //
  //    workbook.loa
  //  }

  public Sheet sortRowsByBeaconDateLastModifiedDesc(
    Sheet sheet,
    String operationName
  ) throws IOException, InvalidFormatException {
    Row headerRow = sheet.getRow(0);
    List<Cell> cellsInHeaderRow = Lists.newArrayList(headerRow.cellIterator());
    List<String> cellValuesInHeaderRow = cellsInHeaderRow
      .stream()
      .map(c -> c.getStringCellValue())
      .collect(Collectors.toList());

    int indexOfLastModifiedDateCol = cellValuesInHeaderRow.indexOf(
      "Last modified date"
    );

    List<Row> allDataRows = Lists.newArrayList(sheet.rowIterator());
    allDataRows.remove(headerRow);

    allDataRows =
      allDataRows
        .stream()
        .sorted(
          Comparator.comparing(r ->
            LocalDate.parse(
              CellUtil
                .getCell(r, indexOfLastModifiedDateCol)
                .getStringCellValue(),
              dateTimeFormatter
            )
          )
        )
        .collect(Collectors.toList());

    allDataRows.add(headerRow);
    Collections.reverse(allDataRows);

    removeAllRows(sheet);

    int currentRowNum = 0;

    for (Row row : allDataRows) {
      writeRow(sheet, currentRowNum, row);
      currentRowNum++;
    }
    //    for (int i = 0; i < allDataRows.size(); i++) {
    //      Row sortedRow = allDataRows.get(i);
    //      List<Cell> cellsInSortedRow = Lists.newArrayList(sortedRow.cellIterator());
    //
    //      Row newRow = sheet.createRow(i);
    //
    //      for (int j = 0; j < cellsInSortedRow.size(); j++) {
    //        newRow.createCell(j).setCellValue(sortedRow.getCell(j).getStringCellValue());
    //      }
    //    }

    return sheet;
  }

  private void removeAllRows(Sheet sheet) {
    for (int i = 0; i < sheet.getLastRowNum(); i++) {
      sheet.removeRow(sheet.getRow(i));
    }
  }

  private void writeRow(Sheet sheet, int currentRowNumber, Row sortedRow) {
    List<String> values = getValuesForSortedRow(sortedRow);
    Row newRow = sheet.createRow(currentRowNumber);
    for (int i = 0; i < values.size(); i++) {
      writeCell(newRow, i, values.get(i));
    }
  }

  private List<String> getValuesForSortedRow(Row sortedRow) {
    List<Cell> cellsInSortedRow = Lists.newArrayList(sortedRow.cellIterator());
    return cellsInSortedRow
      .stream()
      .map(c -> c.getStringCellValue())
      .collect(Collectors.toList());
  }

  private void writeCell(Row newRow, int currentColumnNumber, String value) {
    Cell cell = newRow.createCell(currentColumnNumber);
    cell.setCellValue(value);
  }
}
