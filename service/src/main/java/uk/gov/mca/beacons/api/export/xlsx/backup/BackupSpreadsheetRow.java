package uk.gov.mca.beacons.api.export.xlsx.backup;

import com.fasterxml.jackson.core.JsonProcessingException;
import java.text.MessageFormat;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwner;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.beaconuse.mappers.BeaconUseMapper;
import uk.gov.mca.beacons.api.beaconuse.rest.BeaconUseDTO;
import uk.gov.mca.beacons.api.emergencycontact.domain.EmergencyContact;
import uk.gov.mca.beacons.api.emergencycontact.rest.EmergencyContactDTO;
import uk.gov.mca.beacons.api.export.mappers.ExportMapper;
import uk.gov.mca.beacons.api.export.rest.*;
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
    BeaconBackupItem legacyBeacon,
    ExportMapper exportMapper,
    DateTimeFormatter dateFormatter
  ) {
    BeaconExportDTO mappedLegacyBeacon = exportMapper.toLegacyBeaconExportDTO(
      legacyBeacon
    );

    this.id = Objects.requireNonNull(legacyBeacon.getId());

    populateLegacyBeaconDetails(mappedLegacyBeacon, dateFormatter);

    setNotes(legacyBeacon.getData().getBeacon().getNote());
    populateLegacyUses(mappedLegacyBeacon.getUses());
    populateLegacyOwners(mappedLegacyBeacon.getOwners());
    populateLegacyEmergencyContacts(mappedLegacyBeacon.getEmergencyContacts());
  }

  public BackupSpreadsheetRow(
    Registration registration,
    List<Note> nonSystemNotes,
    BeaconUseMapper beaconUseMapper,
    DateTimeFormatter dateFormatter
  ) throws JsonProcessingException {
    Beacon beacon = registration.getBeacon();
    List<BeaconOwner> owners = registration.getBeaconOwner() != null
      ? List.of(registration.getBeaconOwner())
      : new ArrayList<>();

    this.id = registration.getBeacon().getId().unwrap();

    populateModernBeaconDetails(beacon, dateFormatter);

    setNotes(getStringifiedNotes(nonSystemNotes));
    populateUses(registration.getBeaconUses(), beaconUseMapper);
    populateModernOwners(owners);
    populateModernEmergencyContacts(registration.getEmergencyContacts());
  }

  protected void populateLegacyBeaconDetails(
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

  protected void populateModernBeaconDetails(
    Beacon beacon,
    DateTimeFormatter dateFormatter
  ) {
    this.hexId = beacon.getHexId();
    this.beaconStatus = String.valueOf(beacon.getBeaconStatus());
    this.lastModifiedDate = beacon.getLastModifiedDate().format(dateFormatter);
    this.beaconType = beacon.getBeaconType();
    this.referenceNumber = beacon.getReferenceNumber();
    this.recordCreatedDate = dateFormatter.format(beacon.getCreatedDate());

    this.manufacturer = beacon.getManufacturer();
    this.serialNumber =
      MessageFormat.format("{0}", beacon.getManufacturerSerialNumber());
    this.manufacturerSerialNumber = beacon.getManufacturerSerialNumber();
    this.chkCode = beacon.getChkCode();

    this.mti = beacon.getMti();
    this.svdr = String.valueOf(beacon.getSvdr());
    this.beaconModel = beacon.getModel();

    this.beaconLastServiced =
      beacon.getLastServicedDate() != null
        ? dateFormatter.format(beacon.getLastServicedDate())
        : "";

    this.beaconCoding = beacon.getCoding();

    this.batteryExpiryDate =
      beacon.getBatteryExpiryDate() != null
        ? dateFormatter.format(beacon.getBatteryExpiryDate())
        : "";

    this.codingProtocol = beacon.getProtocol();

    this.cstaNumber = beacon.getCsta();
  }

  protected String getStringifiedNotes(List<Note> notes) {
    return notes != null
      ? JsonSerialiser.mapModernBeaconNotesToJsonArray(notes).toString()
      : "";
  }

  protected void populateModernOwners(List<BeaconOwner> beaconOwners) {
    this.owners =
      beaconOwners != null
        ? JsonSerialiser
          .mapModernBeaconOwnersToJsonArray(beaconOwners)
          .toString()
        : "";
  }

  protected void populateUses(
    List<BeaconUse> beaconUses,
    BeaconUseMapper beaconUseMapper
  ) throws JsonProcessingException {
    List<BeaconUseDTO> beaconUseDTOs = beaconUses != null
      ? beaconUses
        .stream()
        .map(u -> beaconUseMapper.toDTO(u))
        .collect(Collectors.toList())
      : new ArrayList<>();
    this.uses =
      beaconUses != null
        ? JsonSerialiser.mapModernUsesToJsonArray(beaconUseDTOs).toString()
        : "";
  }

  protected void populateModernEmergencyContacts(
    List<EmergencyContact> emergencyContacts
  ) {
    this.emergencyContacts =
      emergencyContacts != null
        ? JsonSerialiser
          .mapModernEmergencyContactsToJsonArray(emergencyContacts)
          .toString()
        : "";
  }

  protected void populateLegacyUses(List<BeaconExportUseDTO> legacyUses) {
    this.uses =
      legacyUses != null
        ? JsonSerialiser.mapLegacyUsesToJsonArray(legacyUses).toString()
        : "";
  }

  protected void populateLegacyOwners(List<BeaconExportOwnerDTO> legacyOwners) {
    this.owners =
      legacyOwners != null
        ? JsonSerialiser
          .mapLegacyBeaconOwnersToJsonArray(legacyOwners)
          .toString()
        : "";
  }

  protected void populateLegacyEmergencyContacts(
    List<EmergencyContactDTO> emergencyContacts
  ) {
    this.emergencyContacts =
      emergencyContacts != null
        ? JsonSerialiser
          .mapLegacyEmergencyContactsToJsonArray(emergencyContacts)
          .toString()
        : "";
  }
}
