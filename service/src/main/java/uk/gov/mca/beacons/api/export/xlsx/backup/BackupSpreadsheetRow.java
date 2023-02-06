package uk.gov.mca.beacons.api.export.xlsx.backup;

import com.fasterxml.jackson.core.JsonProcessingException;
import java.text.MessageFormat;
import java.time.format.DateTimeFormatter;
import java.util.*;
import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import net.minidev.json.JSONArray;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;
import uk.gov.mca.beacons.api.beaconuse.mappers.BeaconUseMapper;
import uk.gov.mca.beacons.api.emergencycontact.rest.EmergencyContactDTO;
import uk.gov.mca.beacons.api.export.mappers.ExportMapper;
import uk.gov.mca.beacons.api.export.rest.*;
import uk.gov.mca.beacons.api.export.rest.backup.BeaconBackupExportDTO;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;
import uk.gov.mca.beacons.api.note.domain.Note;
import uk.gov.mca.beacons.api.registration.domain.Registration;
import uk.gov.mca.beacons.api.utils.BeaconsStringUtils;

/**
 * Represents the contents of a backup export file
 * <p>
 * File format agnostic: the same BackupSpreadsheetRow may be used in a job to write to .csv, .xls, .xlsx etc.
 */
@Getter
@Setter
public class BackupSpreadsheetRow {

  public static final List<String> COLUMN_ATTRIBUTES = List.of(
    "id",
    "hexId",
    "beaconStatus",
    "lastModifiedDate",
    //This is only valid for legacy.
    "cospasSarsatNumber",
    "beaconType",
    //This is only valid for legacy.
    "departmentReference",
    "referenceNumber",
    "recordCreatedDate",
    "manufacturer",
    "serialNumber",
    "manufacturerSerialNumber",
    "chkCode",
    "beaconModel",
    "beaconLastServiced",
    "beaconCoding",
    "batteryExpiryDate",
    "codingProtocol",
    "cstaNumber",
    "mti",
    "svdr",
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
    "Beacon type",
    //This is only valid for legacy.
    "Department reference",
    "Reference number",
    "Record created date",
    "Manufacturer",
    "Serial number",
    "Manufacturer serial number",
    "Chk code",
    "Beacon model",
    "Beacon last serviced",
    "Beacon coding",
    "Battery expiry date",
    "Coding protocol",
    "CSTA number",
    "MTI",
    "SVDR",
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
  private String beaconType;
  //This is only valid for legacy.
  private String departmentReference;
  private String referenceNumber;
  private String recordCreatedDate;
  private String manufacturer;
  // only valid for legacy beacons
  private String serialNumber;
  private String manufacturerSerialNumber;
  // only valid for modern
  private String chkCode;
  private String beaconModel;
  private String beaconLastServiced;
  private String beaconCoding;
  private String batteryExpiryDate;
  private String codingProtocol;
  private String cstaNumber;
  private String mti;
  private String svdr;

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
    BeaconExportDTO mappedLegacyBeacon = exportMapper.toLegacyBeaconExportDTO(
      legacyBeacon
    );

    this.id = Objects.requireNonNull(legacyBeacon.getId()).unwrap();

    setLegacyBeaconDetails(mappedLegacyBeacon, dateFormatter);

    setNotes(legacyBeacon.getData().getBeacon().getNote());
    setLegacyUses(mappedLegacyBeacon.getUses());
    setOwners(mappedLegacyBeacon.getOwners());
    setEmergencyContacts(mappedLegacyBeacon.getEmergencyContacts());
  }

  public static BackupSpreadsheetRow createEmptyRow(UUID id) {
    return new BackupSpreadsheetRow(id);
  }

  private BackupSpreadsheetRow(UUID id) {
    this.id = id;
  }

  public BackupSpreadsheetRow(
    Registration registration,
    AccountHolder accountHolder,
    List<Note> nonSystemNotes,
    ExportMapper exportMapper,
    BeaconUseMapper beaconUseMapper,
    DateTimeFormatter dateFormatter
  ) throws JsonProcessingException {
    BeaconBackupExportDTO mappedBeacon = exportMapper.toBeaconBackupExportDTO(
      registration,
      accountHolder,
      nonSystemNotes,
      beaconUseMapper
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
    this.beaconType = mappedLegacyBeacon.getType();
    this.departmentReference = mappedLegacyBeacon.getDepartmentReference();
    this.referenceNumber = mappedLegacyBeacon.getReferenceNumber();
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

    this.mti = mappedLegacyBeacon.getMti();

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
    BeaconBackupExportDTO mappedBeacon,
    DateTimeFormatter dateFormatter
  ) {
    this.hexId = mappedBeacon.getHexId();
    this.beaconStatus = String.valueOf(mappedBeacon.getBeaconStatus());
    this.lastModifiedDate =
      mappedBeacon.getLastModifiedDate().format(dateFormatter);
    this.beaconType = mappedBeacon.getType();
    this.referenceNumber = mappedBeacon.getReferenceNumber();
    this.recordCreatedDate =
      BeaconsStringUtils.formatDate(
        mappedBeacon.getRecordCreatedDate(),
        dateFormatter
      );
    this.manufacturer = mappedBeacon.getManufacturer();
    this.serialNumber =
      MessageFormat.format("{0}", mappedBeacon.getManufacturerSerialNumber());
    this.manufacturerSerialNumber = mappedBeacon.getManufacturerSerialNumber();
    this.chkCode = mappedBeacon.getChkCode();

    this.mti = mappedBeacon.getMti();
    this.svdr = String.valueOf(mappedBeacon.getSvdr());
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

  protected String getStringifiedNotes(List<Note> notes) {
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

  protected void setUses(JSONArray beaconUses) {
    this.uses = beaconUses != null ? beaconUses.toString() : "";
  }

  protected void setLegacyUses(List<BeaconExportUseDTO> legacyUses) {
    this.uses =
      legacyUses != null
        ? JsonSerialiser.mapLegacyUsesToJsonArray(legacyUses).toString()
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
