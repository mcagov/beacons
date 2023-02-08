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
import org.apache.poi.ss.util.CellReference;
import org.apache.poi.ss.util.CellUtil;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.export.ExportFileNamer;
import uk.gov.mca.beacons.api.export.FileSystemRepository;
import uk.gov.mca.beacons.api.export.xlsx.backup.BackupSpreadsheetRow;

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

  public SXSSFSheet sortRowsByBeaconDateLastModifiedDesc(
    SXSSFSheet sheet,
    String operationName
  ) throws IOException, InvalidFormatException {
    // returns -1 if there are no rows;
    // skips row 0 which is header row
    int currentRowNum = sheet.getFirstRowNum() + 1;

    Row headerRow = sheet.getRow(0);
    List<Cell> cellsInHeaderRow = Lists.newArrayList(headerRow.cellIterator());
    List<String> cellValuesInHeaderRow = cellsInHeaderRow
      .stream()
      .map(c -> c.getStringCellValue())
      .collect(Collectors.toList());

    int indexOfLastModifiedDateCol = cellValuesInHeaderRow.indexOf(
      "Last modified date"
    );

    // rewrite the rows to the sheet
    // ensure header row is still at top of the list
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

    for (int i = 0; i < allDataRows.size(); i++) {
      Row newRow = sheet.createRow(i);
      Row sourceRow = allDataRows.get(i);
      // Loop through source columns to add to new row
      for (int j = 0; j < sourceRow.getLastCellNum(); j++) {
        // Grab a copy of the old/new cell
        Cell oldCell = sourceRow.getCell(j);
        Cell newCell = newRow.createCell(j);

        // If the old cell is null jump to next cell
        if (oldCell == null) {
          newCell = null;
          continue;
        }

        newCell.setCellValue(oldCell.getStringCellValue());
      }
    }

    return sheet;
  }

  private void removeAllRows(Sheet sheet) {
    for (int i = 0; i < sheet.getLastRowNum(); i++) {
      sheet.removeRow(sheet.getRow(i));
    }
  }
}
