package uk.gov.mca.beacons.api.export.csv;

import com.vladmihalcea.hibernate.util.StringUtils;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
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

  private final String DELIMITER = ",";
  private final String SEPARATOR = "\n";
  private final String[] columnHeaders = {
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
    "emergency contacts",
  };

  // need one for modern, one for legacy and put them together

  // take abeacon
  // put it through the ExportMapper to map to CertificateDTO
  // use CertificateDTO values as your row values
  // later on we want e.g a list of uses as an array of stringified json objects
  // write all those values to CSV
  // do it for one beacon first
  // registrations are modern beacons ONLY
  public File generateCsvExport() throws IOException {
    var file = new FileWriter("AlBeaconsExport.csv");
    //Add header
    //        String headers = String.join(" ", " ", ',', this.columnHeaders, 5);
    //        file.append(this.columnHeaders);
    //Add a new line after the header
    file.append(SEPARATOR);
    var id = "b0bc5ca8-eaf3-4ea2-b69a-b52b45e9b912";
    BeaconId beaconId = new BeaconId(UUID.fromString(id));

    try {
      Registration registration = registrationService.getByBeaconId(beaconId);
      CertificateDTO data = exportMapper.toCertificateDTO(
        registration,
        noteService.getNonSystemNotes(beaconId)
      );
    } catch (ResourceNotFoundException ex) {
      LegacyBeacon legacyBeacon = legacyBeaconService
        .findById(new LegacyBeaconId(UUID.fromString(id)))
        .orElseThrow(ResourceNotFoundException::new);
    }
    return new File("AlBeaconsExport.csv");
  }
}
