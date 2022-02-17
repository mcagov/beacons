package uk.gov.mca.beacons.api.search.documents.nested;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import uk.gov.mca.beacons.api.beaconuse.domain.Activity;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.beaconuse.domain.Environment;
import uk.gov.mca.beacons.api.beaconuse.domain.Purpose;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyUse;

@Getter
@Setter
public class NestedBeaconUse {

  public NestedBeaconUse() {}

  public NestedBeaconUse(BeaconUse beaconUse) {
    setEnvironment(beaconUse.getEnvironment());
    setActivity(beaconUse.getActivity());
    setPurpose(beaconUse.getPurpose());
    this.vesselName = beaconUse.getVesselName();
    this.callSign = beaconUse.getCallSign();
    this.aircraftRegistrationMark = beaconUse.getRegistrationMark();
  }

  public NestedBeaconUse(LegacyUse legacyUse) {
    setEnvironment(legacyUse.getEnvironment());
    setActivity(legacyUse.getActivity());
    setPurpose(legacyUse.getPurpose());
    this.vesselName = legacyUse.getVesselName();
    this.callSign = legacyUse.getCallSign();
    this.aircraftRegistrationMark = legacyUse.getAircraftRegistrationMark();
  }

  @Field(type = FieldType.Keyword)
  private String environment;

  @Field(type = FieldType.Keyword)
  private String activity;

  @Field(type = FieldType.Keyword)
  private String purpose;

  @Field(type = FieldType.Keyword)
  private String vesselName;

  @Field(type = FieldType.Keyword)
  private String callSign;

  @Field(type = FieldType.Keyword)
  private String aircraftRegistrationMark;

  public void setEnvironment(Environment environment) {
    if (environment != null) {
      this.environment = environment.toString().toUpperCase();
    } else {
      this.environment = null;
    }
  }

  public void setEnvironment(String environment) {
    if (environment != null) {
      this.environment = environment.toUpperCase();
    } else {
      this.environment = null;
    }
  }

  public void setPurpose(Purpose purpose) {
    if (purpose != null) {
      this.purpose = purpose.toString().toUpperCase();
    } else {
      this.purpose = null;
    }
  }

  public void setPurpose(String purpose) {
    if (purpose != null) {
      this.purpose = purpose.toUpperCase();
    } else {
      this.purpose = null;
    }
  }

  public void setActivity(Activity activity) {
    if (activity != null) {
      this.activity = activity.toString().toUpperCase();
    } else {
      this.activity = null;
    }
  }

  public void setActivity(String activity) {
    if (activity != null) {
      this.activity = activity.toUpperCase();
    } else {
      this.activity = null;
    }
  }
}
