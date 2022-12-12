package uk.gov.mca.beacons.api.export.xlsx.backup;

import java.io.*;
import java.text.MessageFormat;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import javax.swing.filechooser.FileSystemView;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.accountholder.application.AccountHolderService;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderId;
import uk.gov.mca.beacons.api.beacon.application.BeaconService;
import uk.gov.mca.beacons.api.exceptions.ResourceNotFoundException;
import uk.gov.mca.beacons.api.export.mappers.ExportMapper;
import uk.gov.mca.beacons.api.export.rest.BeaconExportDTO;
import uk.gov.mca.beacons.api.legacybeacon.application.LegacyBeaconService;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;
import uk.gov.mca.beacons.api.note.application.NoteService;
import uk.gov.mca.beacons.api.registration.application.RegistrationService;
import uk.gov.mca.beacons.api.registration.domain.Registration;
import uk.gov.mca.beacons.api.utils.BeaconsStringUtils;

@Component
public class SpreadsheetExportGenerator {

  private final RegistrationService registrationService;
  private final BeaconService beaconService;
  private final LegacyBeaconService legacyBeaconService;
  private final NoteService noteService;
  private final AccountHolderService accountHolderService;

  private final ExportMapper exportMapper;

  public SpreadsheetExportGenerator(
    RegistrationService registrationService,
    BeaconService beaconService,
    LegacyBeaconService legacyBeaconService,
    NoteService noteService,
    AccountHolderService accountHolderService,
    ExportMapper exportMapper
  ) {
    this.registrationService = registrationService;
    this.beaconService = beaconService;
    this.legacyBeaconService = legacyBeaconService;
    this.noteService = noteService;
    this.accountHolderService = accountHolderService;
    this.exportMapper = exportMapper;
  }

  private final String fileDestination = FileSystemView
    .getFileSystemView()
    .getHomeDirectory()
    .getAbsoluteFile()
    .getAbsolutePath();
  private final String delimiter = "~";
  private final String separator = "\n";
  private final int batchSize = 200;
  private static final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern(
    "dd-MM-yyyy"
  );

  private final List<String> columnHeaders = List.of(
    "ID",
    "Hex ID",
    "Beacon Status",
    "Last modified date",
    //This is only valid for legacy.
    "Cospas Sarsat Number",
    "Type",
    "Proof of registration date",
    //This is only valid for legacy.
    "Department reference",
    "Record created date",
    "Manufacturer",
    "Serial number",
    "Manufacturer serial number",
    "Beacon model",
    "Beacon last serviced",
    "Beacon coding",
    "Battery expiry date",
    "Coding protocol",
    "CSTA number",
    //This is only valid for legacy.
    "Beacon note",
    //These are only valid for new beacons
    "Notes",
    "Uses",
    "Owners",
    "Emergency contacts"
  );

  public FileSystemResource generateXlsxBackupExport()
    throws IOException, InvalidFormatException {
    FileWriter csvFile = prepareCsvFile();

    exportBeaconsInBatches(csvFile);

    csvFile.close();

    return convertCsvToXlsxFile();
  }

  private FileWriter prepareCsvFile() throws IOException {
    var file = new FileWriter(
      MessageFormat.format("{0}{1}", fileDestination, "/AllBeaconsExport.csv")
    );

    String headers = String.join(delimiter, this.columnHeaders);
    file.append(headers);
    file.append(separator);

    return file;
  }

  public void exportBeaconsInBatches(FileWriter file) throws IOException {
    int totalNumberOfBeaconsToExport =
      beaconService.findAll().size() + legacyBeaconService.findAll().size();
    int numberAlreadyTaken = 0;
    int numberRemaining = totalNumberOfBeaconsToExport;

    if (numberRemaining > batchSize) {
      while (numberRemaining > 0) {
        // to-do: ask Sam
        ArrayList<Registration> batchOfBeacons = registrationService
          .getBatch(batchSize, numberAlreadyTaken)
          .sort(
            Comparator
              .comparing(r -> r.getBeacon().getLastModifiedDate())
              .reversed()
          );

        List<LegacyBeacon> batchOfLegacyBeacons = legacyBeaconService.getBatch(
          batchSize,
          numberAlreadyTaken
        );

        for (Registration registration : batchOfBeacons) {
          AccountHolderId accountHolderId = registration
            .getBeacon()
            .getAccountHolderId();
          AccountHolder accountHolder = accountHolderService
            .getAccountHolder(accountHolderId)
            .orElseThrow(ResourceNotFoundException::new);

          BeaconExportDTO beaconExport = exportMapper.toBeaconBackupExportDTO(
            registration,
            accountHolder,
            noteService.getNonSystemNotes(registration.getBeacon().getId())
          );
          writeToFile(file, beaconExport);
        }

        for (LegacyBeacon legacyBeacon : batchOfLegacyBeacons) {
          BeaconExportDTO beaconExport = exportMapper.toLegacyBeaconBackupExportDTO(
            legacyBeacon
          );
          writeToFile(file, beaconExport);
        }
        numberAlreadyTaken = numberAlreadyTaken + batchSize;
        numberRemaining = numberRemaining - batchSize;
      }
    } else {
      ArrayList<Registration> batchOfBeacons = registrationService.getBatch(
        numberRemaining,
        numberAlreadyTaken
      );
      List<LegacyBeacon> batchOfLegacyBeacons = legacyBeaconService.getBatch(
        batchSize,
        numberAlreadyTaken
      );

      for (Registration registration : batchOfBeacons) {
        AccountHolderId accountHolderId = registration
          .getBeacon()
          .getAccountHolderId();
        AccountHolder accountHolder = accountHolderService
          .getAccountHolder(accountHolderId)
          .orElseThrow(ResourceNotFoundException::new);

        BeaconExportDTO beaconExport = exportMapper.toBeaconExportDTO(
          registration,
          accountHolder,
          noteService.getNonSystemNotes(registration.getBeacon().getId())
        );
        writeToFile(file, beaconExport);
      }

      for (LegacyBeacon legacyBeacon : batchOfLegacyBeacons) {
        if (legacyBeacon.getData().getBeacon() == null) {
          continue;
        }
        BeaconExportDTO beaconExport = exportMapper.toLegacyBeaconExportDTO(
          legacyBeacon
        );
        writeToFile(file, beaconExport);
      }
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
    String owners = (
        beaconExport.getOwners() != null &&
        beaconExport.getOwners().get(0) != null
      )
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
      MessageFormat.format("{0}{1}", beaconExport.getId(), delimiter)
    );
    file.append(
      MessageFormat.format("{0}{1}", beaconExport.getHexId(), delimiter)
    );
    file.append(
      MessageFormat.format(
        "{0}{1}",
        beaconExport.getBeaconStatus().toUpperCase(),
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
        beaconExport.getCospasSarsatNumber(),
        delimiter
      )
    );
    file.append(
      MessageFormat.format("{0}{1}", beaconExport.getType(), delimiter)
    );
    file.append(
      MessageFormat.format(
        "{0}{1}",
        BeaconsStringUtils.getUppercaseValueOrEmpty(
          beaconExport.getProofOfRegistrationDate().format(dateFormatter)
        ),
        delimiter
      )
    );
    file.append(
      MessageFormat.format(
        "{0}{1}",
        BeaconsStringUtils.getUppercaseValueOrEmpty(
          beaconExport.getDepartmentReference()
        ),
        delimiter
      )
    );
    file.append(
      MessageFormat.format(
        "{0}{1}",
        BeaconsStringUtils.formatDate(
          beaconExport.getRecordCreatedDate(),
          dateFormatter
        ),
        delimiter
      )
    );
    file.append(
      MessageFormat.format(
        "{0}{1}",
        BeaconsStringUtils.getUppercaseValueOrEmpty(
          beaconExport.getManufacturer()
        ),
        delimiter
      )
    );
    file.append(
      MessageFormat.format("{0}{1}", beaconExport.getSerialNumber(), delimiter)
    );
    file.append(
      MessageFormat.format(
        "{0}{1}",
        BeaconsStringUtils.getUppercaseValueOrEmpty(
          beaconExport.getManufacturerSerialNumber()
        ),
        delimiter
      )
    );
    file.append(
      MessageFormat.format(
        "{0}{1}",
        BeaconsStringUtils.getUppercaseValueOrEmpty(
          beaconExport.getBeaconModel()
        ),
        delimiter
      )
    );
    file.append(
      MessageFormat.format(
        "{0}{1}",
        BeaconsStringUtils.formatDate(
          beaconExport.getBeaconlastServiced(),
          dateFormatter
        ),
        delimiter
      )
    );
    file.append(
      MessageFormat.format(
        "{0}{1}",
        BeaconsStringUtils.getUppercaseValueOrEmpty(
          beaconExport.getBeaconCoding()
        ),
        delimiter
      )
    );
    file.append(
      MessageFormat.format(
        "{0}{1}",
        (
          BeaconsStringUtils.formatDate(
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
        BeaconsStringUtils.getUppercaseValueOrEmpty(
          beaconExport.getCodingProtocol()
        ),
        delimiter
      )
    );
    file.append(
      MessageFormat.format(
        "{0}{1}",
        BeaconsStringUtils.getUppercaseValueOrEmpty(
          beaconExport.getCstaNumber()
        ),
        delimiter
      )
    );
    file.append(
      MessageFormat.format(
        "{0}{1}",
        BeaconsStringUtils.getUppercaseValueOrEmpty(
          beaconExport.getBeaconNote()
        ),
        delimiter
      )
    );
    file.append(MessageFormat.format("{0}{1}", notes, delimiter));
    file.append(MessageFormat.format("{0}{1}", uses, delimiter));
    file.append(MessageFormat.format("{0}{1}", owners, delimiter));
    file.append(MessageFormat.format("{0}{1}", emergencyContacts, delimiter));

    file.append(separator);
  }

  private FileSystemResource convertCsvToXlsxFile()
    throws IOException, InvalidFormatException {
    try {
      File csv = new File(
        MessageFormat.format("{0}{1}", fileDestination, "/AllBeaconsExport.csv")
      );
      XSSFWorkbook workbook = new XSSFWorkbook();
      XSSFSheet sheet = workbook.createSheet("All exported beacons");

      String currentLine;
      int rowNumber = -1;
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

      return new FileSystemResource(
        MessageFormat.format(
          "{0}{1}",
          fileDestination,
          "/AllBeaconsExport.xlsx"
        )
      );
    } catch (Exception e) {
      throw (e);
    }
  }
}
