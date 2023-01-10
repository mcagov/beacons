package uk.gov.mca.beacons.api.export.xlsx.backup;

import java.util.*;
import java.util.stream.Collectors;
import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.lang.Nullable;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwner;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.emergencycontact.domain.EmergencyContact;
import uk.gov.mca.beacons.api.export.xlsx.SpreadsheetRow;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyEmergencyContact;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyOwner;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyUse;
import uk.gov.mca.beacons.api.note.domain.Note;

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
    "cospasSarsatNumber",
    "ownerName",
    "ownerTelephoneNumber",
    "ownerAlternativeTelephoneNumber",
    "ownerEmail",
    "emergencyContact_1",
    "emergencyContact_2",
    "emergencyContact_3",
    "useActivities",
    "mmsiNumbers",
    "vesselNames",
    "vesselCallsigns",
    "aircraftTailMarks",
    "aircraft24BitHexAddresses"
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
    //This is only valid for legacy.
    "Beacon note",
    //These are only valid for new beacons
    "Notes",
    "Uses",
    "Owners",
    "Emergency contacts"
  );

  @NotNull
  private final UUID id;

  private String hexId;
  private String ownerName;
  private String beaconStatus;
  private String lastModifiedDate;
  private String cospasSarsatNumber;
  private String ownerTelephoneNumber;
  private String ownerAlternativeTelephoneNumber;
  private String ownerEmail;
  private String emergencyContact_1;
  private String emergencyContact_2;
  private String emergencyContact_3;
  private String useActivities;
  private String mmsiNumbers;
  private String vesselNames;
  private String vesselCallsigns;
  private String aircraftTailMarks;
  private String aircraft24BitHexAddresses;
  private String notes;

  public BackupSpreadsheetRow(LegacyBeacon legacyBeacon) {
    this.id = Objects.requireNonNull(legacyBeacon.getId()).unwrap();

    // Beacon details
    this.hexId = legacyBeacon.getHexId();
    this.beaconStatus = legacyBeacon.getBeaconStatus();
    this.lastModifiedDate = legacyBeacon.getLastModifiedDate().toString();

    Integer cospasSarsatNumber = legacyBeacon
      .getData()
      .getBeacon()
      .getCospasSarsatNumber();
    if (cospasSarsatNumber != null) {
      this.cospasSarsatNumber = cospasSarsatNumber.toString();
    }

    setOwnerDetails(legacyBeacon.getData().getOwner());

    setLegacyUses(legacyBeacon.getData().getUses());

    setEmergencyContact(legacyBeacon.getData().getEmergencyContact());

    setNotes(legacyBeacon.getData().getBeacon().getNote());
  }

  public BackupSpreadsheetRow(
    Beacon beacon,
    @Nullable BeaconOwner beaconOwner,
    List<BeaconUse> beaconUses,
    List<EmergencyContact> emergencyContacts,
    List<Note> notes
  ) {
    this.id = Objects.requireNonNull(beacon.getId()).unwrap();

    this.hexId = beacon.getHexId();
    this.lastModifiedDate = beacon.getLastModifiedDate().toString();
    this.beaconStatus = beacon.getBeaconStatus().toString();

    setOwnerDetails(beaconOwner);

    setUses(beaconUses);

    setEmergencyContacts(emergencyContacts);
  }

  protected void setOwnerDetails(BeaconOwner beaconOwner) {
    if (beaconOwner != null) {
      this.ownerName = beaconOwner.getFullName();
      this.ownerTelephoneNumber = beaconOwner.getTelephoneNumber();
      this.ownerAlternativeTelephoneNumber =
        beaconOwner.getAlternativeTelephoneNumber();
    }
  }

  protected void setOwnerDetails(LegacyOwner legacyOwner) {
    this.ownerName = legacyOwner.getOwnerName();
    this.ownerTelephoneNumber =
      concatenateFields(legacyOwner.getPhone1(), legacyOwner.getMobile1());
    this.ownerAlternativeTelephoneNumber =
      concatenateFields(legacyOwner.getPhone2(), legacyOwner.getMobile2());
    this.ownerEmail = legacyOwner.getEmail();
  }

  // todo: set these and the notes as JSON with the JsonSerialiser
  protected void setUses(List<BeaconUse> beaconUses) {
    // Wasteful implementation, could iterate over beacon uses once and get all the fields, but this is simpler
    // for the time being.
    this.mmsiNumbers =
      beaconUses
        .stream()
        .map(BeaconUse::getMmsiNumbers)
        .flatMap(Collection::stream)
        .filter(Objects::nonNull)
        .filter(s -> !s.isBlank())
        .collect(Collectors.joining(" / "));

    this.vesselNames =
      beaconUses
        .stream()
        .map(BeaconUse::getVesselName)
        .filter(Objects::nonNull)
        .filter(s -> !s.isBlank())
        .collect(Collectors.joining(" / "));

    this.vesselCallsigns =
      beaconUses
        .stream()
        .map(BeaconUse::getCallSign)
        .filter(Objects::nonNull)
        .filter(s -> !s.isBlank())
        .collect(Collectors.joining());

    this.aircraftTailMarks =
      beaconUses
        .stream()
        .map(BeaconUse::getRegistrationMark)
        .filter(Objects::nonNull)
        .filter(s -> !s.isBlank())
        .collect(Collectors.joining(" / "));

    this.aircraft24BitHexAddresses =
      beaconUses
        .stream()
        .map(BeaconUse::getHexAddress)
        .filter(Objects::nonNull)
        .filter(s -> !s.isBlank())
        .collect(Collectors.joining(" / "));
  }

  protected void setLegacyUses(List<LegacyUse> legacyUses) {
    this.mmsiNumbers =
      legacyUses
        .stream()
        .map(LegacyUse::getMmsiNumber)
        .filter(Objects::nonNull)
        .map(Number::toString)
        .filter(s -> !s.isBlank())
        .collect(Collectors.joining(" / "));

    this.vesselNames =
      legacyUses
        .stream()
        .map(LegacyUse::getVesselName)
        .filter(Objects::nonNull)
        .filter(s -> !s.isBlank())
        .collect(Collectors.joining(" / "));

    this.vesselCallsigns =
      legacyUses
        .stream()
        .map(LegacyUse::getCallSign)
        .filter(Objects::nonNull)
        .filter(s -> !s.isBlank())
        .collect(Collectors.joining(" / "));

    this.aircraftTailMarks =
      legacyUses
        .stream()
        .map(LegacyUse::getAircraftRegistrationMark)
        .filter(Objects::nonNull)
        .filter(s -> !s.isBlank())
        .collect(Collectors.joining(" / "));

    this.aircraft24BitHexAddresses =
      legacyUses
        .stream()
        .map(LegacyUse::getBit24AddressHex)
        .filter(Objects::nonNull)
        .filter(s -> !s.isBlank())
        .collect(Collectors.joining(" / "));
  }

  protected void setEmergencyContacts(
    List<EmergencyContact> emergencyContacts
  ) {
    int len = emergencyContacts.size();

    if (len > 0) {
      EmergencyContact emergencyContact = emergencyContacts.get(0);
      this.emergencyContact_1 =
        concatenateFields(
          emergencyContact.getFullName(),
          emergencyContact.getTelephoneNumber(),
          emergencyContact.getAlternativeTelephoneNumber()
        );
    }

    if (len > 1) {
      EmergencyContact emergencyContact = emergencyContacts.get(1);
      this.emergencyContact_2 =
        concatenateFields(
          emergencyContact.getFullName(),
          emergencyContact.getTelephoneNumber(),
          emergencyContact.getAlternativeTelephoneNumber()
        );
    }

    if (len > 2) {
      EmergencyContact emergencyContact = emergencyContacts.get(2);
      this.emergencyContact_3 =
        concatenateFields(
          emergencyContact.getFullName(),
          emergencyContact.getTelephoneNumber(),
          emergencyContact.getAlternativeTelephoneNumber()
        );
    }
  }

  protected void setEmergencyContact(
    LegacyEmergencyContact legacyEmergencyContact
  ) {
    if (legacyEmergencyContact != null) {
      this.emergencyContact_1 = legacyEmergencyContact.getDetails();
    }
  }

  protected String concatenateFields(String... fields) {
    return Arrays
      .stream(fields)
      .filter(Objects::nonNull)
      .filter(s -> !s.isBlank())
      .collect(Collectors.joining(" / "));
  }
}
