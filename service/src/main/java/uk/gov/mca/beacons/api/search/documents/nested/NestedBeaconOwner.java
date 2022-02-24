package uk.gov.mca.beacons.api.search.documents.nested;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwner;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyOwner;

@Getter
@Setter
public class NestedBeaconOwner {

  public NestedBeaconOwner() {}

  public NestedBeaconOwner(BeaconOwner beaconOwner) {
    this.ownerName = beaconOwner.getFullName();
    this.ownerEmail = beaconOwner.getEmail();
  }

  public NestedBeaconOwner(LegacyOwner legacyOwner) {
    this.ownerName = legacyOwner.getOwnerName();
    this.ownerEmail = legacyOwner.getEmail();
  }

  @Field(type = FieldType.Keyword)
  private String ownerName;

  @Field(type = FieldType.Keyword)
  private String ownerEmail;
}
