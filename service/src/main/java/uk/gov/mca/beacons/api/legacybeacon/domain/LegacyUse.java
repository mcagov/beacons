package uk.gov.mca.beacons.api.legacybeacon.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import lombok.*;
import uk.gov.mca.beacons.api.shared.domain.base.ValueObject;
import uk.gov.mca.beacons.api.utils.LegacyDataSanitiser;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class LegacyUse implements ValueObject, Serializable {

  private String note;
  private String notes;
  private String isMain;
  private String landUse;
  private String rigName;
  private String useType;
  private String callSign;
  private String homePort;
  private String position;
  private String tripInfo;
  private String areaOfUse;
  private String beaconNsn;
  private String imoNumber;
  private Integer fkBeaconId;
  private Integer maxPersons;
  private Integer mmsiNumber;
  private Integer versioning;
  private String vesselName;
  private String vesselType;
  private String createdDate;
  private String aircraftType;
  private Integer createUserId;
  private String hullIdNumber;
  private String rssSsrNumber;
  private Integer updateUserId;
  private String cg66RefNumber;
  private String pennantNumber;
  private String beaconPosition;
  private String communications;
  private String officialNumber;
  private Integer pkBeaconUsesId;
  private String aodSerialNumber;
  private String bit24AddressHex;
  private String beaconPartNumber;
  private String fishingVesselPln;
  private String lastModifiedDate;
  private String principalAirport;
  private String localManagementId;
  private String survivalCraftType;
  private String aircraftDescription;
  private String aircraftRegistrationMark;

  public String getEnvironment() {
    return getUseType();
  }

  public String getPurpose() {
    String purpose = LegacyDataSanitiser.chooseField(
      this.aircraftType,
      this.vesselType
    );

    if (
      purpose != null &&
      !purpose.equals("COMMERCIAL") &&
      !purpose.equals("PLEASURE")
    ) {
      return null;
    }

    return purpose;
  }

  public String getActivity() {
    String activity = LegacyDataSanitiser.chooseField(
      this.aircraftType,
      this.landUse,
      this.vesselType
    );

    if (
      activity != null &&
      !activity.equals("COMMERCIAL") &&
      !activity.equals("PLEASURE")
    ) {
      return null;
    }

    return activity;
  }
}
