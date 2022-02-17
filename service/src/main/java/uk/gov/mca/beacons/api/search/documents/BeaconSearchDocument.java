package uk.gov.mca.beacons.api.search.documents;

import java.time.LocalDate;
import java.time.OffsetDateTime;
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
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwner;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;
import uk.gov.mca.beacons.api.search.documents.nested.NestedBeaconOwner;
import uk.gov.mca.beacons.api.search.documents.nested.NestedBeaconUse;

@Getter
@Setter
@Document(indexName = "beacon_search")
public class BeaconSearchDocument {

  public BeaconSearchDocument() {}

  public BeaconSearchDocument(
    Beacon beacon,
    BeaconOwner beaconOwner,
    List<BeaconUse> beaconUses
  ) {
    this.id = Objects.requireNonNull(beacon.getId()).unwrap();
    this.hexId = beacon.getHexId();
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
    this.beaconUses =
      beaconUses
        .stream()
        .map(NestedBeaconUse::new)
        .collect(Collectors.toList());
  }

  public BeaconSearchDocument(LegacyBeacon legacyBeacon) {
    this.id = Objects.requireNonNull(legacyBeacon.getId()).unwrap();
    this.hexId = legacyBeacon.getHexId();
    this.beaconStatus = legacyBeacon.getBeaconStatus();
    this.createdDate = legacyBeacon.getCreatedDate();
    this.lastModifiedDate = legacyBeacon.getLastModifiedDate();
    this.manufacturerSerialNumber =
      legacyBeacon.getData().getBeacon().getManufacturerSerialNumber();
    this.beaconOwner = new NestedBeaconOwner(legacyBeacon.getData().getOwner());
    this.beaconUses =
      legacyBeacon
        .getData()
        .getUses()
        .stream()
        .map(NestedBeaconUse::new)
        .collect(Collectors.toList());
  }

  @Id
  private UUID id;

  @Field(type = FieldType.Keyword)
  private String hexId;

  @Field(type = FieldType.Keyword)
  private String beaconStatus;

  @Field(type = FieldType.Boolean, index = false)
  private boolean isLegacy;

  @Field(type = FieldType.Date)
  private OffsetDateTime createdDate;

  @Field(type = FieldType.Date)
  private OffsetDateTime lastModifiedDate;

  @Field(type = FieldType.Keyword)
  private String manufacturerSerialNumber;

  @Field(type = FieldType.Keyword)
  private String cospasSarsatNumber;

  @Field(type = FieldType.Keyword)
  private String referenceNumber;

  @Field(type = FieldType.Date)
  private LocalDate batteryExpiryDate;

  @Field(type = FieldType.Date)
  private LocalDate lastServicedDate;

  @Field(type = FieldType.Nested)
  private NestedBeaconOwner beaconOwner;

  @Field(type = FieldType.Nested)
  private List<NestedBeaconUse> beaconUses;
}
