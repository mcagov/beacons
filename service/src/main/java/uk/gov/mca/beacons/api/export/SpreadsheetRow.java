package uk.gov.mca.beacons.api.export;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.lang.Nullable;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwner;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.emergencycontact.domain.EmergencyContact;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyOwner;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyUse;

/**
 * Represents the contents of a spreadsheet export.
 * <p>
 * File format agnostic: the same SpreadsheetRow may be used in a job to write to .csv, .xls, .xlsx etc.
 */
@Getter
@Setter
public class SpreadsheetRow {

  /**
   * UUID, HexID, vesselMmsiNumbers, vesselNames, vesselCallsigns, aircraftRegistrationMarks,
   * aircraft24bitHexAddresses, lastModifiedDate, beaconStatus, useActivities (e.g. "Maritime, Aviation"),
   * manufacturerSerialNumber, cospasSarsatNumber, Owner (name, telephone, email),
   * EmergencyContacts (name, telephone) [NB - This matches searchable fields in OpenSearch]
   */
  @Getter
  private static final List<String> columnAttributes = List.of(
    "id",
    "hexId",
    "beaconStatus",
    "lastModifiedDate",
    "cospasSarsatNumber",
    "ownerName",
    "ownerTelephoneNumber",
    "ownerEmail",
    "emergencyContactName_1",
    "emergencyContactTelephoneNumber_1",
    "emergencyContactAlternativeTelephoneNumber_1",
    "emergencyContactName_2",
    "emergencyContactTelephoneNumber_2",
    "emergencyContactAlternativeTelephoneNumber_2",
    "emergencyContactName_3",
    "emergencyContactTelephoneNumber_3",
    "emergencyContactAlternativeTelephoneNumber_3",
    "useActivities",
    "mmsiNumbers",
    "vesselNames",
    "vesselCallsigns",
    "aircraftTailmark",
    "aircraft24BitHexAddress"
  );

  @Getter
  private static final List<String> columnHeadings = List.of(
    "ID",
    "Hex ID",
    "Beacon Status",
    "Last-modified date",
    "Cospas-Sarsat Number",
    "Owner name",
    "Owner telephone number",
    "Owner alternative telephone number",
    "Owner email",
    "Emergency contact name (1)",
    "Emergency contact telephone number (1)",
    "Emergency contact alternative telephone number (1)",
    "Emergency contact name (2)",
    "Emergency contact telephone number (2)",
    "Emergency contact alternative telephone number (2)",
    "Emergency contact name (3)",
    "Emergency contact telephone number (3)",
    "Emergency contact alternative telephone number (3)",
    "Use activities",
    "MMSI numbers",
    "Vessel names",
    "Vessel call signs",
    "Aircraft tail mark",
    "Aircraft 24-bit hex address"
  );

  @NotNull
  private final UUID id;

  private String hexId;
  private String ownerName;
  private String beaconStatus;
  private OffsetDateTime lastModifiedDate;
  private String cospasSarsatNumber;
  private String ownerTelephoneNumber;
  private String ownerAlternativeTelephoneNumber;
  private String ownerEmail;
  private String emergencyContactName_1;
  private String emergencyContactTelephoneNumber_1;
  private String emergencyContactAlternativeTelephoneNumber_1;
  private String emergencyContactName_2;
  private String emergencyContactTelephoneNumber_2;
  private String emergencyContactAlternativeTelephoneNumber_2;
  private String emergencyContactName_3;
  private String emergencyContactTelephoneNumber_3;
  private String emergencyContactAlternativeTelephoneNumber_3;
  private String useActivities;
  private String mmsiNumbers;
  private String vesselNames;
  private String vesselCallsigns;
  private String aircraftTailMarks;
  private String aircraft24BitHexAddresses;

  public SpreadsheetRow(LegacyBeacon legacyBeacon) {
    this.id = Objects.requireNonNull(legacyBeacon.getId()).unwrap();

    // Beacon details
    this.hexId = legacyBeacon.getHexId();
    this.beaconStatus = legacyBeacon.getBeaconStatus();
    this.lastModifiedDate = legacyBeacon.getLastModifiedDate();
    this.cospasSarsatNumber =
      legacyBeacon.getData().getBeacon().getCospasSarsatNumber().toString();

    // Beacon owner
    setOwnerDetails(legacyBeacon.getData().getOwner());

    // Beacon uses
    setLegacyUses(legacyBeacon.getData().getUses());
  }

  public SpreadsheetRow(
    Beacon beacon,
    @Nullable BeaconOwner beaconOwner,
    List<BeaconUse> beaconUses,
    List<EmergencyContact> emergencyContacts
  ) {
    this.id = Objects.requireNonNull(beacon.getId()).unwrap();

    // Beacon details;
    this.hexId = beacon.getHexId();
    this.lastModifiedDate = beacon.getLastModifiedDate();
    this.beaconStatus = beacon.getBeaconStatus().toString();

    // Beacon owner
    setOwnerDetails(beaconOwner);

    // Beacon uses
    setUses(beaconUses);
    // Emergency contacts
  }

  private void setOwnerDetails(BeaconOwner beaconOwner) {
    if (beaconOwner != null) {
      this.ownerName = beaconOwner.getFullName();
      this.ownerTelephoneNumber = beaconOwner.getTelephoneNumber();
      this.ownerAlternativeTelephoneNumber =
        beaconOwner.getAlternativeTelephoneNumber();
    }
  }

  private void setOwnerDetails(LegacyOwner legacyOwner) {
    this.ownerName = legacyOwner.getOwnerName();
    this.ownerTelephoneNumber =
      concatenateFields(legacyOwner.getPhone1(), legacyOwner.getMobile1());
    this.ownerAlternativeTelephoneNumber =
      concatenateFields(legacyOwner.getPhone2(), legacyOwner.getMobile2());
    this.ownerEmail = legacyOwner.getEmail();
  }

  private void setUses(List<BeaconUse> beaconUses) {
    // Wasteful implementation, could iterate over beacon uses once and get all the fields, but this is simpler
    // for the time being.
    this.mmsiNumbers =
      beaconUses
        .stream()
        .map(BeaconUse::getMmsiNumbers)
        .flatMap(Collection::stream)
        .filter(Objects::nonNull)
        .collect(Collectors.joining(" / "));

    this.vesselNames =
      beaconUses
        .stream()
        .map(BeaconUse::getVesselName)
        .filter(Objects::nonNull)
        .collect(Collectors.joining(" / "));

    this.vesselCallsigns =
      beaconUses
        .stream()
        .map(BeaconUse::getCallSign)
        .filter(Objects::nonNull)
        .collect(Collectors.joining());

    this.aircraftTailMarks =
      beaconUses
        .stream()
        .map(BeaconUse::getRegistrationMark)
        .filter(Objects::nonNull)
        .collect(Collectors.joining(" / "));

    this.aircraft24BitHexAddresses =
      beaconUses
        .stream()
        .map(BeaconUse::getHexAddress)
        .filter(Objects::nonNull)
        .collect(Collectors.joining(" / "));
  }

  private void setLegacyUses(List<LegacyUse> legacyUses) {
    this.mmsiNumbers =
      legacyUses
        .stream()
        .map(LegacyUse::getMmsiNumber)
        .filter(Objects::nonNull)
        .map(Number::toString)
        .collect(Collectors.joining(" / "));

    this.vesselNames =
      legacyUses
        .stream()
        .map(LegacyUse::getVesselName)
        .filter(Objects::nonNull)
        .collect(Collectors.joining(" / "));

    this.vesselCallsigns =
      legacyUses
        .stream()
        .map(LegacyUse::getCallSign)
        .filter(Objects::nonNull)
        .collect(Collectors.joining(" / "));

    this.aircraftTailMarks =
      legacyUses
        .stream()
        .map(LegacyUse::getAircraftRegistrationMark)
        .filter(Objects::nonNull)
        .collect(Collectors.joining(" / "));

    this.aircraft24BitHexAddresses =
      legacyUses
        .stream()
        .map(LegacyUse::getBit24AddressHex)
        .filter(Objects::nonNull)
        .collect(Collectors.joining(" / "));
  }

  private String concatenateFields(String... fields) {
    return Arrays
      .stream(fields)
      .filter(Objects::nonNull)
      .collect(Collectors.joining(" / "));
  }
}
