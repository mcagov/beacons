package uk.gov.mca.beacons.api.export.csv;

import com.vladmihalcea.hibernate.util.StringUtils;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.MessageFormat;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import javax.validation.Valid;
import lombok.*;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.emergencycontact.rest.EmergencyContactDTO;
import uk.gov.mca.beacons.api.exceptions.ResourceNotFoundException;
import uk.gov.mca.beacons.api.export.SpreadsheetRow;
import uk.gov.mca.beacons.api.export.mappers.ExportMapper;
import uk.gov.mca.beacons.api.export.rest.CertificateDTO;
import uk.gov.mca.beacons.api.export.rest.CertificateNoteDTO;
import uk.gov.mca.beacons.api.export.rest.CertificateOwnerDTO;
import uk.gov.mca.beacons.api.export.rest.CertificateUseDTO;
import uk.gov.mca.beacons.api.legacybeacon.application.LegacyBeaconService;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeaconId;
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

  // need one for modern, one for legacy and put them together
  // need another batching findAll for legacyBeaconService/repository
  // later on we want e.g a list of uses as an array of stringified json objects
  public FileWriter generateCsvExport() throws IOException {
    // prepare file
    var file = new FileWriter("~./AllBeaconsExport.csv");

    String headers = String.join(delimiter, this.columnHeaders);
    file.append(headers);
    file.append(separator);

    // just do it for one beacon now
    var id = "b0bc5ca8-eaf3-4ea2-b69a-b52b45e9b912";
    BeaconId beaconId = new BeaconId(UUID.fromString(id));

    // get beacon/l. beacon and map it
    CertificateDTO mappedBeacon = new CertificateDTO();

    try {
      Registration registration = registrationService.getByBeaconId(beaconId);
      mappedBeacon =
        exportMapper.toCertificateDTO(
          registration,
          noteService.getNonSystemNotes(beaconId)
        );
    } catch (ResourceNotFoundException ex) {
      LegacyBeacon legacyBeacon = legacyBeaconService
        .findById(new LegacyBeaconId(UUID.fromString(id)))
        .orElseThrow(ResourceNotFoundException::new);
      mappedBeacon = exportMapper.toLegacyCertificateDTO(legacyBeacon);
    }

    // write to csv
    file.append(mappedBeacon.getType());
    file.append(mappedBeacon.getProofOfRegistrationDate().toString());
    file.append(mappedBeacon.getDepartmentReference());
    file.append(mappedBeacon.getRecordCreatedDate());
    file.append(mappedBeacon.getLastModifiedDate().toString());
    file.append(mappedBeacon.getBeaconStatus());
    file.append(mappedBeacon.getHexId());
    file.append(mappedBeacon.getManufacturer());
    file.append(MessageFormat.format("{0}", mappedBeacon.getSerialNumber()));
    file.append(mappedBeacon.getManufacturerSerialNumber());
    file.append(mappedBeacon.getBeaconModel());
    file.append(mappedBeacon.getBeaconlastServiced());
    file.append(mappedBeacon.getBeaconCoding());
    file.append(mappedBeacon.getBatteryExpiryDate());
    file.append(mappedBeacon.getCodingProtocol());
    file.append(mappedBeacon.getCstaNumber());
    file.append(mappedBeacon.getBeaconNote());
    // these lists need more thought
    file.append(mappedBeacon.getNotes().toString());
    file.append(mappedBeacon.getUses().toString());
    file.append(mappedBeacon.getOwners().toString());
    file.append(mappedBeacon.getEmergencyContacts().toString());

    file.close();
    var stringFromFile = file.toString();
    return file;
  }
}
