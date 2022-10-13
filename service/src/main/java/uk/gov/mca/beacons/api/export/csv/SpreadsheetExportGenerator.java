package uk.gov.mca.beacons.api.export.csv;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.MessageFormat;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;
import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.tomcat.jni.Local;
import uk.gov.mca.beacons.api.export.mappers.ExportMapper;
import uk.gov.mca.beacons.api.export.rest.BeaconExportDTO;
import uk.gov.mca.beacons.api.export.rest.BeaconExportNoteDTO;
import uk.gov.mca.beacons.api.legacybeacon.application.LegacyBeaconService;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;
import uk.gov.mca.beacons.api.note.application.NoteService;
import uk.gov.mca.beacons.api.registration.application.RegistrationService;
import uk.gov.mca.beacons.api.registration.domain.Registration;

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

  private final String delimiter = ",";
  private final String separator = "\n";
  private final int batchSize = 10;
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

  public FileWriter generateCsvExport() throws IOException {
    FileWriter file = prepareFile();

    // do with one small batch first
    // then do a loop batching the whole lot chunk by chunk
    // we'll likely need a screen showing the progress of the export
    ArrayList<Registration> batchOfBeacons = registrationService.getBatch(
      batchSize,
      0
    );
    List<LegacyBeacon> batchOfLegacyBeacons = legacyBeaconService.getBatch(
      batchSize,
      0
    );

    for (Registration registration : batchOfBeacons) {
      BeaconExportDTO beaconExport = exportMapper.toBeaconExportDTO(
        registration,
        noteService.getNonSystemNotes(registration.getBeacon().getId())
      );
      file = writeToFile(file, beaconExport);
    }

    for (LegacyBeacon legacyBeacon : batchOfLegacyBeacons) {
      BeaconExportDTO beaconExport = exportMapper.toLegacyBeaconExportDTO(
        legacyBeacon
      );
      file = writeToFile(file, beaconExport);
    }

    file.close();
    return file;
  }

  private FileWriter prepareFile() throws IOException {
    String fileName = "/Users/evie.skinner/AllBeaconsExport.xlsx";
    var file = new FileWriter(fileName);

    String headers = String.join(delimiter, this.columnHeaders);
    file.append(headers);
    file.append(separator);

    return file;
  }

  //todo: how do I chunk it down further?
  private FileWriter writeToFile(FileWriter file, BeaconExportDTO beaconExport)
    throws IOException {
    // format legacy only values
    String legacyNotes = beaconExport.getBeaconNote() != null
      ? beaconExport.getBeaconNote().toUpperCase()
      : "";
    String deptRef = beaconExport.getDepartmentReference() != null
      ? beaconExport.getDepartmentReference()
      : "";

    // serialise nested lists
    String notes = beaconExport.getNotes() != null
      ? JsonSerialiser
        .mapModernBeaconNotesToJsonArray(beaconExport.getNotes())
        .toString()
      : "";
    // uses will go here
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

    // escape commas
    String serialNumber = MessageFormat.format(
      "{0}",
      beaconExport.getSerialNumber()
    );
    String codingProtocol = StringEscapeUtils.escapeCsv(
      beaconExport.getCodingProtocol().toUpperCase()
    );
    legacyNotes = StringEscapeUtils.escapeCsv(legacyNotes);
    serialNumber = StringEscapeUtils.escapeCsv(serialNumber);
    notes = StringEscapeUtils.escapeCsv(notes);
    owners = StringEscapeUtils.escapeCsv(owners);
    emergencyContacts = StringEscapeUtils.escapeCsv(emergencyContacts);

    // todo: serialise and add uses
    file =
      appendValuesToFile(
        file,
        beaconExport,
        deptRef,
        serialNumber,
        codingProtocol,
        legacyNotes,
        notes,
        owners,
        emergencyContacts
      );
    return file;
  }

  // todo: consider using one dictionary of properties instead of loads of sepearate arguments
  private FileWriter appendValuesToFile(
    FileWriter file,
    BeaconExportDTO beaconExport,
    String deptRef,
    String serialNumber,
    String codingProtocol,
    String legacyNotes,
    String notes,
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
    file.append(MessageFormat.format("{0}{1}", deptRef, delimiter));
    file.append(
      MessageFormat.format(
        "{0}{1}",
        beaconExport.getRecordCreatedDate(),
        //(OffsetDateTime.parse(beaconExport.getRecordCreatedDate())).format(dateFormatter),
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
    file.append(MessageFormat.format("{0}{1}", serialNumber, delimiter));
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
        (LocalDate.parse(beaconExport.getBeaconlastServiced())).format(
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
        (LocalDate.parse(beaconExport.getBatteryExpiryDate())).format(
            dateFormatter
          ),
        delimiter
      )
    );
    file.append(MessageFormat.format("{0}{1}", codingProtocol, delimiter));
    file.append(
      MessageFormat.format("{0}{1}", beaconExport.getCstaNumber(), delimiter)
    );
    file.append(MessageFormat.format("{0}{1}", legacyNotes, delimiter));
    file.append(MessageFormat.format("{0}{1}", notes, delimiter));
    file.append(MessageFormat.format("{0}{1}", "Uses list", delimiter));
    file.append(MessageFormat.format("{0}{1}", owners, delimiter));
    file.append(MessageFormat.format("{0}{1}", emergencyContacts, delimiter));

    file.append(separator);
    return file;
  }
}
