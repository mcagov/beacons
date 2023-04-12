package uk.gov.mca.beacons.api.export.rest;

import java.util.Map;
import javax.validation.Valid;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
public abstract class BeaconExportUseDTO {

  @Valid
  String environment;

  @Valid
  public boolean isMainUse;

  @Valid
  String typeOfUse;

  @Valid
  String beaconPosition;

  @Valid
  String beaconLocation;

  @Valid
  Map<String, String> radioSystems;

  @Valid
  //Only used for legacy
  String notes;
}
