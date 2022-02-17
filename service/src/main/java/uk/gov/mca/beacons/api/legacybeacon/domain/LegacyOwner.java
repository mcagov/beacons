package uk.gov.mca.beacons.api.legacybeacon.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import lombok.*;
import uk.gov.mca.beacons.api.shared.domain.base.ValueObject;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class LegacyOwner implements ValueObject, Serializable {

  private String fax;
  private String email;
  private String careOf;
  private String isMain;
  private String phone1;
  private String phone2;
  private String country;
  private String mobile1;
  private String mobile2;
  private String address1;
  private String address2;
  private String address3;
  private String address4;
  private String postCode;
  private String ownerName;
  private Integer fkBeaconId;
  private Integer versioning;
  private String companyName;
  private String createdDate;
  private String createUserId;
  private String updateUserId;
  private Integer pkBeaconOwnerId;
  private String lastModifiedDate;
}
