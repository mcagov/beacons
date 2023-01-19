package uk.gov.mca.beacons.api.export.xlsx.backup;

import java.text.MessageFormat;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.lang.Nullable;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwner;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.emergencycontact.domain.EmergencyContact;
import uk.gov.mca.beacons.api.emergencycontact.rest.EmergencyContactDTO;
import uk.gov.mca.beacons.api.export.mappers.ExportMapper;
import uk.gov.mca.beacons.api.export.rest.BeaconExportDTO;
import uk.gov.mca.beacons.api.export.rest.BeaconExportNoteDTO;
import uk.gov.mca.beacons.api.export.rest.BeaconExportOwnerDTO;
import uk.gov.mca.beacons.api.export.rest.BeaconExportUseDTO;
import uk.gov.mca.beacons.api.export.xlsx.SpreadsheetRow;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyEmergencyContact;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyOwner;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyUse;
import uk.gov.mca.beacons.api.note.domain.Note;
import uk.gov.mca.beacons.api.note.rest.NoteDTO;
import uk.gov.mca.beacons.api.registration.domain.Registration;
import uk.gov.mca.beacons.api.utils.BeaconsStringUtils;

/**
 * Represents the contents of a backup export file
 * <p>
 * File format agnostic: the same BackupSpreadsheetRow may be used in a job to write to .csv, .xls, .xlsx etc.
 */
@Getter
@Setter
public class BackupSpreadsheetRow implements SpreadsheetRow {

  public static final List<String> COLUMN_ATTRIBUTES = List.of(
    "id",
    "hexId",
    "beaconStatus",
    "lastModifiedDate",
    //This is only valid for legacy.
    "cospasSarsatNumber",
    "type",
    "proofOfRegistrationDate",
    //This is only valid for legacy.
    "departmentReference",
    "recordCreatedDate",
    "manufacturer",
    "serialNumber",
    "manufacturerSerialNumber",
    "beaconModel",
    "beaconLastServiced",
    "beaconCoding",
    "batteryExpiryDate",
    "codingProtocol",
    "cstaNumber",
    //These are only valid for new beacons
    "notes",
    "uses",
    "owners",
    "emergencyContacts"
  );

  public static final List<String> COLUMN_HEADINGS = List.of(
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
    //These are only valid for new beacons
    "Notes",
    "Uses",
    "Owners",
    "Emergency contacts"
  );

  @NotNull
  private final UUID id;

  private String hexId;
  private String beaconStatus;
  private String lastModifiedDate;
  //This is only valid for legacy.
  private String cospasSarsatNumber;
  private String type;
  private String proofOfRegistrationDate;
  //This is only valid for legacy.
  private String departmentReference;
  private String recordCreatedDate;
  private String manufacturer;
  private String serialNumber;
  private String manufacturerSerialNumber;
  private String beaconModel;
  private String beaconLastServiced;
  private String beaconCoding;
  private String batteryExpiryDate;
  private String codingProtocol;
  private String cstaNumber;

  //These are only valid for new beacons
  private String notes;
  private String uses;
  private String owners;
  private String emergencyContacts;

  public BackupSpreadsheetRow(
    LegacyBeacon legacyBeacon,
    ExportMapper exportMapper,
    DateTimeFormatter dateFormatter
  ) {
    BeaconExportDTO mappedLegacyBeacon = exportMapper.toLegacyBeaconBackupExportDTO(
      legacyBeacon
    );

    this.id = Objects.requireNonNull(legacyBeacon.getId()).unwrap();

    setLegacyBeaconDetails(mappedLegacyBeacon, dateFormatter);

    setNotes(legacyBeacon.getData().getBeacon().getNote());
    setUses(mappedLegacyBeacon.getUses());
    setOwners(mappedLegacyBeacon.getOwners());
    setEmergencyContacts(mappedLegacyBeacon.getEmergencyContacts());
  }

  public BackupSpreadsheetRow(
    Registration registration,
    AccountHolder accountHolder,
    List<Note> notes,
    ExportMapper exportMapper,
    DateTimeFormatter dateFormatter
  ) {
    BeaconExportDTO mappedBeacon = exportMapper.toBeaconBackupExportDTO(
      registration,
      accountHolder,
      notes
    );

    this.id = registration.getBeacon().getId().unwrap();

    setModernBeaconDetails(mappedBeacon, dateFormatter);

    setNotes(getStringifiedNotes(mappedBeacon.getNotes()));
    setUses(mappedBeacon.getUses());
    setOwners(mappedBeacon.getOwners());
    setEmergencyContacts(mappedBeacon.getEmergencyContacts());
  }

  protected void setLegacyBeaconDetails(
    BeaconExportDTO mappedLegacyBeacon,
    DateTimeFormatter dateFormatter
  ) {
    this.hexId = mappedLegacyBeacon.getHexId();
    this.beaconStatus = mappedLegacyBeacon.getBeaconStatus();
    this.lastModifiedDate =
      mappedLegacyBeacon.getLastModifiedDate().format(dateFormatter);
    this.cospasSarsatNumber = mappedLegacyBeacon.getCospasSarsatNumber();
    this.type = mappedLegacyBeacon.getType();
    this.proofOfRegistrationDate =
      mappedLegacyBeacon.getProofOfRegistrationDate().format(dateFormatter);
    this.departmentReference = mappedLegacyBeacon.getDepartmentReference();
    this.recordCreatedDate =
      BeaconsStringUtils.formatDate(
        mappedLegacyBeacon.getRecordCreatedDate(),
        dateFormatter
      );
    this.manufacturer = mappedLegacyBeacon.getManufacturer();
    this.serialNumber =
      MessageFormat.format("{0}", mappedLegacyBeacon.getSerialNumber());
    this.manufacturerSerialNumber =
      mappedLegacyBeacon.getManufacturerSerialNumber();
    this.beaconModel = mappedLegacyBeacon.getBeaconModel();

    this.beaconLastServiced =
      BeaconsStringUtils.formatDate(
        mappedLegacyBeacon.getBeaconlastServiced(),
        dateFormatter
      );

    this.beaconCoding = mappedLegacyBeacon.getBeaconCoding();

    this.batteryExpiryDate =
      BeaconsStringUtils.formatDate(
        mappedLegacyBeacon.getBatteryExpiryDate(),
        dateFormatter
      );

    this.codingProtocol = mappedLegacyBeacon.getCodingProtocol();

    this.cstaNumber = mappedLegacyBeacon.getCstaNumber();
  }

  protected void setModernBeaconDetails(
    BeaconExportDTO mappedBeacon,
    DateTimeFormatter dateFormatter
  ) {
    this.hexId = mappedBeacon.getHexId();
    this.beaconStatus = mappedBeacon.getBeaconStatus();
    this.lastModifiedDate =
      mappedBeacon.getLastModifiedDate().format(dateFormatter);
    this.type = mappedBeacon.getType();
    this.proofOfRegistrationDate =
      mappedBeacon.getProofOfRegistrationDate().format(dateFormatter);
    this.recordCreatedDate =
      BeaconsStringUtils.formatDate(
        mappedBeacon.getRecordCreatedDate(),
        dateFormatter
      );
    this.manufacturer = mappedBeacon.getManufacturer();
    this.serialNumber =
      MessageFormat.format("{0}", mappedBeacon.getSerialNumber());
    this.manufacturerSerialNumber = mappedBeacon.getManufacturerSerialNumber();
    this.beaconModel = mappedBeacon.getBeaconModel();

    this.beaconLastServiced =
      BeaconsStringUtils.formatDate(
        mappedBeacon.getBeaconlastServiced(),
        dateFormatter
      );

    this.beaconCoding = mappedBeacon.getBeaconCoding();

    this.batteryExpiryDate =
      BeaconsStringUtils.formatDate(
        mappedBeacon.getBatteryExpiryDate(),
        dateFormatter
      );

    this.codingProtocol = mappedBeacon.getCodingProtocol();

    this.cstaNumber = mappedBeacon.getCstaNumber();
  }

  protected String getStringifiedNotes(List<BeaconExportNoteDTO> notes) {
    return notes != null
      ? JsonSerialiser.mapModernBeaconNotesToJsonArray(notes).toString()
      : "";
  }

  protected void setOwners(List<BeaconExportOwnerDTO> beaconOwners) {
    this.owners =
      beaconOwners != null
        ? JsonSerialiser.mapBeaconOwnersToJsonArray(beaconOwners).toString()
        : "";
  }

  protected void setUses(List<BeaconExportUseDTO> beaconUses) {
    this.uses =
      beaconUses != null
        ? JsonSerialiser.mapUsesToJsonArray(beaconUses).toString()
        : "";
  }

  protected void setEmergencyContacts(
    List<EmergencyContactDTO> emergencyContacts
  ) {
    this.emergencyContacts =
      emergencyContacts != null
        ? JsonSerialiser
          .mapEmergencyContactsToJsonArray(emergencyContacts)
          .toString()
        : "";
  }
}
