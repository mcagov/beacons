package uk.gov.mca.beacons.api.export.csv;

import java.io.FileWriter;
import java.io.IOException;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;
import org.apache.commons.lang3.StringEscapeUtils;
import uk.gov.mca.beacons.api.export.mappers.ExportMapper;
import uk.gov.mca.beacons.api.export.rest.CertificateDTO;
import uk.gov.mca.beacons.api.export.rest.CertificateNoteDTO;
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

  // later on we want e.g a list of uses as an array of stringified json objects
  public FileWriter generateCsvExport() throws IOException {
    FileWriter file = prepareFile();

    // do with one small batch first
    // then do a loop batching the whole lot chunk by chunk
    // we'll likely need a screen showing the progress of the export
    // we want all strings to be capitalised
    ArrayList<Registration> batchOfBeacons = registrationService.getBatch(
      batchSize,
      0
    );
    List<LegacyBeacon> batchOfLegacyBeacons = legacyBeaconService.getBatch(
      batchSize,
      0
    );

    for (Registration registration : batchOfBeacons) {
      CertificateDTO mappedBeacon = exportMapper.toCertificateDTO(
        registration,
        noteService.getNonSystemNotes(registration.getBeacon().getId())
      );
      file = writeToFile(file, mappedBeacon);
    }

    for (LegacyBeacon legacyBeacon : batchOfLegacyBeacons) {
      CertificateDTO mappedBeacon = exportMapper.toLegacyCertificateDTO(
        legacyBeacon
      );
      file = writeToFile(file, mappedBeacon);
    }

    file.close();
    return file;
  }

  private FileWriter prepareFile() throws IOException {
    String fileName = "/Users/evie.skinner/AllBeaconsExport.csv";
    var file = new FileWriter(fileName);

    String headers = String.join(delimiter, this.columnHeaders);
    file.append(headers);
    file.append(separator);

    return file;
  }

  private FileWriter writeToFile(FileWriter file, CertificateDTO mappedBeacon)
    throws IOException {
    // format legacy only values
    String legacyNotes = mappedBeacon.getBeaconNote() != null
      ? mappedBeacon.getBeaconNote().toUpperCase()
      : "";
    String deptRef = mappedBeacon.getDepartmentReference() != null
      ? mappedBeacon.getDepartmentReference()
      : "";

    // check for nulls
    JSONArray notes = mappedBeacon.getNotes() != null
      ? JsonSerialiser.mapModernBeaconNotesToJsonArray(mappedBeacon.getNotes())
      : null;
    String serialNumber = MessageFormat.format(
      "{0}",
      mappedBeacon.getSerialNumber()
    );

    // escape commas
    String codingProtocol = StringEscapeUtils.escapeCsv(
      mappedBeacon.getCodingProtocol().toUpperCase()
    );
    legacyNotes = StringEscapeUtils.escapeCsv(legacyNotes);
    serialNumber = StringEscapeUtils.escapeCsv(serialNumber);

    file.append(
      MessageFormat.format("{0}{1}", mappedBeacon.getType(), delimiter)
    );
    file.append(
      MessageFormat.format(
        "{0}{1}",
        mappedBeacon.getProofOfRegistrationDate().toString(),
        delimiter
      )
    );
    file.append(MessageFormat.format("{0}{1}", deptRef, delimiter));
    file.append(
      MessageFormat.format(
        "{0}{1}",
        mappedBeacon.getRecordCreatedDate(),
        delimiter
      )
    );
    file.append(
      MessageFormat.format(
        "{0}{1}",
        mappedBeacon.getLastModifiedDate().toString(),
        delimiter
      )
    );
    file.append(
      MessageFormat.format(
        "{0}{1}",
        mappedBeacon.getBeaconStatus().toUpperCase(),
        delimiter
      )
    );
    file.append(
      MessageFormat.format("{0}{1}", mappedBeacon.getHexId(), delimiter)
    );
    file.append(
      MessageFormat.format(
        "{0}{1}",
        mappedBeacon.getManufacturer().toUpperCase(),
        delimiter
      )
    );
    file.append(MessageFormat.format("{0}{1}", serialNumber, delimiter));
    file.append(
      MessageFormat.format(
        "{0}{1}",
        mappedBeacon.getManufacturerSerialNumber(),
        delimiter
      )
    );
    file.append(
      MessageFormat.format(
        "{0}{1}",
        mappedBeacon.getBeaconModel().toUpperCase(),
        delimiter
      )
    );
    file.append(
      MessageFormat.format(
        "{0}{1}",
        mappedBeacon.getBeaconlastServiced(),
        delimiter
      )
    );
    file.append(
      MessageFormat.format("{0}{1}", mappedBeacon.getBeaconCoding(), delimiter)
    );
    file.append(
      MessageFormat.format(
        "{0}{1}",
        mappedBeacon.getBatteryExpiryDate(),
        delimiter
      )
    );
    file.append(MessageFormat.format("{0}{1}", codingProtocol, delimiter));
    file.append(
      MessageFormat.format("{0}{1}", mappedBeacon.getCstaNumber(), delimiter)
    );
    file.append(MessageFormat.format("{0}{1}", legacyNotes, delimiter));
    // these lists need more thought
    file.append(MessageFormat.format("{0}{1}", notes, delimiter));
    file.append(
      MessageFormat.format(
        "{0}{1}",
        mappedBeacon.getUses().toString(),
        delimiter
      )
    );
    file.append(
      MessageFormat.format(
        "{0}{1}",
        mappedBeacon.getOwners().toString(),
        delimiter
      )
    );
    file.append(
      MessageFormat.format(
        "{0}{1}",
        mappedBeacon.getEmergencyContacts().toString(),
        delimiter
      )
    );

    file.append(separator);

    return file;
  }
}
