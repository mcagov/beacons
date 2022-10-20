package uk.gov.mca.beacons.api.export.xlsx.backup;

import java.io.*;
import java.text.MessageFormat;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.beaconuse.domain.Environment;
import uk.gov.mca.beacons.api.export.mappers.ExportMapper;
import uk.gov.mca.beacons.api.export.rest.BeaconExportDTO;
import uk.gov.mca.beacons.api.legacybeacon.application.LegacyBeaconService;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;
import uk.gov.mca.beacons.api.note.application.NoteService;
import uk.gov.mca.beacons.api.registration.application.RegistrationService;
import uk.gov.mca.beacons.api.registration.domain.Registration;
import uk.gov.mca.beacons.api.utils.StringUtils;

public class SpreadsheetExportGenerator {

  private final RegistrationService registrationService;
  private final LegacyBeaconService legacyBeaconService;
  private final NoteService noteService;

  private final ExportMapper exportMapper;

  public SpreadsheetExportGenerator(
    RegistrationService registrationService,
    LegacyBeaconService legacyBeaconService,
    NoteService noteService,
    ExportMapper exportMapper
  ) {
    this.registrationService = registrationService;
    this.legacyBeaconService = legacyBeaconService;
    this.noteService = noteService;
    this.exportMapper = exportMapper;
  }

  private String fileDestination = "/tmp/beacons/export";
  private final String delimiter = "~";
  private final String separator = "\n";
  private final int batchSize = 200;
  private static final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern(
    "dd-MM-yyyy"
  );
  private final List<String> columnHeaders = List.of(
    "type",
    "proof of registration date",
    //This is only valid for legacy.
    "department reference",
    "record created date",
    "last modified date",
    "beacon status",
    "hexId",
    "manufacturer",
    "serial number",
    "manufacturer serial number",
    "beacon model",
    "beacon last serviced",
    "beacon coding",
    "battery expiry date",
    "coding protocol",
    "csta number",
    //This is only valid for legacy.
    "beacon note",
    //These are only valid for new beacons
    "notes",
    "uses",
    "owners",
    "emergency contacts"
  );

  public void generateXlsxBackupExport()
    throws IOException, InvalidFormatException {
    FileWriter csvFile = prepareCsvFile();

    exportBeaconsInBatches(csvFile);

    csvFile.close();

    convertCsvToXlsxFile();
  }

  private FileWriter prepareCsvFile() throws IOException {
    String fileName = MessageFormat.format(
      "{0}{1}",
      fileDestination,
      "/AllBeaconsExport.csv"
    );
    var file = new FileWriter(fileName);

    String headers = String.join(delimiter, this.columnHeaders);
    file.append(headers);
    file.append(separator);

    return file;
  }

  public void exportBeaconsInBatches(FileWriter file) throws IOException {
    int numberAlreadyTaken = 0;

    for (int i = 0; i <= batchSize; i++) {
      ArrayList<Registration> batchOfBeacons = registrationService.getBatch(
        batchSize,
        numberAlreadyTaken
      );
      List<LegacyBeacon> batchOfLegacyBeacons = legacyBeaconService.getBatch(
        batchSize,
        numberAlreadyTaken
      );

      for (Registration registration : batchOfBeacons) {
        BeaconExportDTO beaconExport = exportMapper.toBeaconExportDTO(
          registration,
          noteService.getNonSystemNotes(registration.getBeacon().getId())
        );
        writeToFile(file, beaconExport);
      }

      for (LegacyBeacon legacyBeacon : batchOfLegacyBeacons) {
        BeaconExportDTO beaconExport = exportMapper.toLegacyBeaconExportDTO(
          legacyBeacon
        );
        writeToFile(file, beaconExport);
      }
      numberAlreadyTaken = numberAlreadyTaken + batchSize;
    }
  }

  private void writeToFile(FileWriter file, BeaconExportDTO beaconExport)
    throws IOException {
    String notes = beaconExport.getNotes() != null
      ? JsonSerialiser
        .mapModernBeaconNotesToJsonArray(beaconExport.getNotes())
        .toString()
      : "";
    String uses = beaconExport.getUses() != null
      ? JsonSerialiser.mapUsesToJsonArray(beaconExport.getUses()).toString()
      : "";
    String owners = beaconExport.getOwners() != null
      ? JsonSerialiser
        .mapBeaconOwnersToJsonArray(beaconExport.getOwners())
        .toString()
      : "";
    String emergencyContacts = beaconExport.getEmergencyContacts() != null
      ? JsonSerialiser
        .mapEmergencyContactsToJsonArray(beaconExport.getEmergencyContacts())
        .toString()
      : "";

    appendValuesToFile(
      file,
      beaconExport,
      notes,
      uses,
      owners,
      emergencyContacts
    );
  }

  private void appendValuesToFile(
    FileWriter file,
    BeaconExportDTO beaconExport,
    String notes,
    String uses,
    String owners,
    String emergencyContacts
  ) throws IOException {
    file.append(
      MessageFormat.format("{0}{1}", beaconExport.getType(), delimiter)
    );
    file.append(
      MessageFormat.format(
        "{0}{1}",
        beaconExport.getProofOfRegistrationDate().format(dateFormatter),
        delimiter
      )
    );
    file.append(
      MessageFormat.format(
        "{0}{1}",
        beaconExport.getDepartmentReference() != null
          ? beaconExport.getDepartmentReference()
          : "",
        delimiter
      )
    );
    file.append(
      MessageFormat.format(
        "{0}{1}",
        StringUtils.formatDate(
          beaconExport.getRecordCreatedDate(),
          dateFormatter
        ),
        delimiter
      )
    );
    file.append(
      MessageFormat.format(
        "{0}{1}",
        beaconExport.getLastModifiedDate().format(dateFormatter),
        delimiter
      )
    );
    file.append(
      MessageFormat.format(
        "{0}{1}",
        beaconExport.getBeaconStatus().toUpperCase(),
        delimiter
      )
    );
    file.append(
      MessageFormat.format("{0}{1}", beaconExport.getHexId(), delimiter)
    );
    file.append(
      MessageFormat.format(
        "{0}{1}",
        beaconExport.getManufacturer().toUpperCase(),
        delimiter
      )
    );
    file.append(
      MessageFormat.format("{0}{1}", beaconExport.getSerialNumber(), delimiter)
    );
    file.append(
      MessageFormat.format(
        "{0}{1}",
        beaconExport.getManufacturerSerialNumber(),
        delimiter
      )
    );
    file.append(
      MessageFormat.format(
        "{0}{1}",
        beaconExport.getBeaconModel().toUpperCase(),
        delimiter
      )
    );
    file.append(
      MessageFormat.format(
        "{0}{1}",
        StringUtils.formatDate(
          beaconExport.getBeaconlastServiced(),
          dateFormatter
        ),
        delimiter
      )
    );
    file.append(
      MessageFormat.format("{0}{1}", beaconExport.getBeaconCoding(), delimiter)
    );
    file.append(
      MessageFormat.format(
        "{0}{1}",
        (
          StringUtils.formatDate(
            beaconExport.getBatteryExpiryDate(),
            dateFormatter
          )
        ),
        delimiter
      )
    );
    file.append(
      MessageFormat.format(
        "{0}{1}",
        beaconExport.getCodingProtocol().toUpperCase(),
        delimiter
      )
    );
    file.append(
      MessageFormat.format("{0}{1}", beaconExport.getCstaNumber(), delimiter)
    );
    file.append(
      MessageFormat.format(
        "{0}{1}",
        beaconExport.getBeaconNote() != null
          ? beaconExport.getBeaconNote().toUpperCase()
          : "",
        delimiter
      )
    );
    file.append(MessageFormat.format("{0}{1}", notes, delimiter));
    file.append(MessageFormat.format("{0}{1}", uses, delimiter));
    file.append(MessageFormat.format("{0}{1}", owners, delimiter));
    file.append(MessageFormat.format("{0}{1}", emergencyContacts, delimiter));

    file.append(separator);
  }

  private void convertCsvToXlsxFile()
    throws IOException, InvalidFormatException {
    try {
      File csv = new File(
        MessageFormat.format("{0}{1}", fileDestination, "/AllBeaconsExport.csv")
      );
      XSSFWorkbook workbook = new XSSFWorkbook();
      XSSFSheet sheet = workbook.createSheet("All exported beacons");

      String currentLine;
      int rowNumber = 0;
      BufferedReader fileReader = new BufferedReader(new FileReader(csv));

      while ((currentLine = fileReader.readLine()) != null) {
        String[] valuesOnCurrentLine = currentLine.split(delimiter);
        rowNumber++;
        XSSFRow currentRow = sheet.createRow(rowNumber);

        for (int i = 0; i < valuesOnCurrentLine.length; i++) {
          valuesOnCurrentLine[i] = valuesOnCurrentLine[i].replaceAll("\"", "");
          XSSFCell cell = currentRow.createCell(i);
          cell.setCellValue(valuesOnCurrentLine[i].trim());
        }
      }
      FileOutputStream excelFileOutputStream = new FileOutputStream(
        MessageFormat.format(
          "{0}{1}",
          fileDestination,
          "/AllBeaconsExport.xlsx"
        )
      );
      workbook.write(excelFileOutputStream);
      excelFileOutputStream.close();
    } catch (Exception e) {
      throw (e);
    }
  }
}
