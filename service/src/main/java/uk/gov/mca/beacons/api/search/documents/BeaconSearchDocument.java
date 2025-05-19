package uk.gov.mca.beacons.api.search.documents;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.annotations.Setting;
import org.springframework.lang.NonNull;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwner;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyUse;
import uk.gov.mca.beacons.api.search.documents.nested.NestedBeaconOwner;
import uk.gov.mca.beacons.api.search.documents.nested.NestedBeaconUse;

@Getter
@Setter
@Document(indexName = "beacon_search")
@Setting(settingPath = "/opensearch/beacon-search-index-settings.json")
public class BeaconSearchDocument {

  @Id
  private UUID id;

  @Field(type = FieldType.Text, analyzer = "case_insensitive_keyword")
  private String hexId;

  @Field(type = FieldType.Keyword)
  private String beaconStatus;

  @Field(type = FieldType.Boolean, index = false)
  private boolean isLegacy;

  @Field(type = FieldType.Date)
  private OffsetDateTime createdDate;

  @Field(type = FieldType.Date)
  private OffsetDateTime lastModifiedDate;

  @Field(type = FieldType.Text, analyzer = "case_insensitive_keyword")
  private String manufacturerSerialNumber;

  @Field(type = FieldType.Text, analyzer = "case_insensitive_keyword")
  private String cospasSarsatNumber;

  @Field(type = FieldType.Text, analyzer = "case_insensitive_keyword")
  private String referenceNumber;

  @Field(type = FieldType.Date)
  private LocalDate batteryExpiryDate;

  @Field(type = FieldType.Date)
  private LocalDate lastServicedDate;

  @Field(
    type = FieldType.Text,
    analyzer = "case_and_whitespace_insensitive_keyword"
  )
  private List<String> vesselMmsiNumbers;

  @Field(type = FieldType.Text)
  private List<String> vesselNames;

  @Field(type = FieldType.Text, analyzer = "case_insensitive_keyword")
  private List<String> vesselCallsigns;

  @Field(type = FieldType.Text, analyzer = "case_insensitive_keyword")
  private List<String> aircraftRegistrationMarks;

  @Field(type = FieldType.Text, analyzer = "case_insensitive_keyword")
  private List<String> aircraft24bitHexAddresses;

  @Field(type = FieldType.Nested)
  private NestedBeaconOwner beaconOwner;

  @Field(type = FieldType.Nested)
  private List<NestedBeaconUse> beaconUses;

  public BeaconSearchDocument() {}

  public BeaconSearchDocument(
    Beacon beacon,
    BeaconOwner beaconOwner,
    @NonNull List<BeaconUse> beaconUses
  ) {
    Objects.requireNonNull(beaconUses);
    this.id = Objects.requireNonNull(beacon.getId()).unwrap();
    this.beaconStatus = beacon.getBeaconStatus().toString();
    this.createdDate = beacon.getCreatedDate();
    this.lastModifiedDate = beacon.getLastModifiedDate();
    this.manufacturerSerialNumber = beacon.getManufacturerSerialNumber();
    this.referenceNumber = beacon.getReferenceNumber();
    this.batteryExpiryDate = beacon.getBatteryExpiryDate();
    this.lastServicedDate = beacon.getLastServicedDate();
    if (beaconOwner != null) {
      this.beaconOwner = new NestedBeaconOwner(beaconOwner);
    }
    setBeaconRegistrationIdentifiers(beacon, beaconOwner, beaconUses);
    this.beaconUses = beaconUses
      .stream()
      .map(NestedBeaconUse::new)
      .collect(Collectors.toList());
    this.isLegacy = false;
  }

  public BeaconSearchDocument(LegacyBeacon legacyBeacon) {
    Objects.requireNonNull(legacyBeacon.getData().getUses());
    this.id = Objects.requireNonNull(legacyBeacon.getId()).unwrap();
    this.isLegacy = true;
    this.beaconStatus = legacyBeacon.getBeaconStatus();
    this.createdDate = legacyBeacon.getCreatedDate();
    this.lastModifiedDate = legacyBeacon.getLastModifiedDate();
    this.manufacturerSerialNumber = legacyBeacon
      .getData()
      .getBeacon()
      .getManufacturerSerialNumber();
    this.beaconOwner = new NestedBeaconOwner(legacyBeacon.getData().getOwner());
    this.beaconUses = legacyBeacon
      .getData()
      .getUses()
      .stream()
      .map(NestedBeaconUse::new)
      .collect(Collectors.toList());
    setBeaconRegistrationIdentifiers(legacyBeacon);
  }

  /**
   * An identifier is a field that is unique to a single registration or a
   * small set of registrations and can be used by SAR to find a Beacon
   * registration using common search patterns.
   */
  private void setBeaconRegistrationIdentifiers(
    Beacon beacon,
    BeaconOwner beaconOwner,
    List<BeaconUse> beaconUses
  ) {
    this.hexId = beacon.getHexId();
    this.vesselMmsiNumbers = beaconUses
      .stream()
      .map(BeaconUse::getMmsiNumbers)
      .flatMap(Collection::stream)
      .collect(Collectors.toList());
    this.vesselNames = beaconUses
      .stream()
      .map(BeaconUse::getVesselName)
      .filter(Objects::nonNull)
      .collect(Collectors.toList());
    this.vesselCallsigns = beaconUses
      .stream()
      .map(BeaconUse::getCallSign)
      .filter(Objects::nonNull)
      .collect(Collectors.toList());
    this.aircraftRegistrationMarks = beaconUses
      .stream()
      .map(BeaconUse::getRegistrationMark)
      .filter(Objects::nonNull)
      .collect(Collectors.toList());
    this.aircraft24bitHexAddresses = beaconUses
      .stream()
      .map(BeaconUse::getHexAddress)
      .filter(Objects::nonNull)
      .collect(Collectors.toList());
  }

  private void setBeaconRegistrationIdentifiers(LegacyBeacon legacyBeacon) {
    this.hexId = legacyBeacon.getHexId();

    var cospasSarsatNumber = legacyBeacon
      .getData()
      .getBeacon()
      .getCospasSarsatNumber();
    if (cospasSarsatNumber != null) {
      this.cospasSarsatNumber = cospasSarsatNumber.toString();
    }

    var uses = legacyBeacon.getData().getUses();
    this.vesselMmsiNumbers = uses
      .stream()
      .map(LegacyUse::getMmsiNumber)
      .filter(Objects::nonNull)
      .map(Number::toString)
      .collect(Collectors.toList());
    this.vesselNames = uses
      .stream()
      .map(LegacyUse::getVesselName)
      .filter(Objects::nonNull)
      .collect(Collectors.toList());
    this.vesselCallsigns = uses
      .stream()
      .map(LegacyUse::getCallSign)
      .filter(Objects::nonNull)
      .collect(Collectors.toList());
    this.aircraftRegistrationMarks = uses
      .stream()
      .map(LegacyUse::getAircraftRegistrationMark)
      .filter(Objects::nonNull)
      .collect(Collectors.toList());
    this.aircraft24bitHexAddresses = uses
      .stream()
      .map(LegacyUse::getBit24AddressHex)
      .filter(Objects::nonNull)
      .collect(Collectors.toList());
  }
}
