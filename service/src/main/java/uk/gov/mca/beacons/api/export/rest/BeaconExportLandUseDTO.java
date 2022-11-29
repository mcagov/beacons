package uk.gov.mca.beacons.api.export.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import javax.validation.Valid;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BeaconExportLandUseDTO extends BeaconExportUseDTO {

  @Valid
  private String environment;

  @Valid
  private String typeOfUse;

  @Valid
  private String beaconPosition;

  @Valid
  private String beaconLocation;

  @Valid
  private String windfarmLocation;

  @Valid
  private String rigPlatformLocation;

  @Valid
  private String descriptionOfIntendedUse;

  @Valid
  private int numberOfPersonsOnBoard;

  @Valid
  private String areaOfUse;

  @Valid
  private String tripInformation;

  @Valid
  private Map<String, String> radioSystems;

  @Valid
  //Only used for legacy
  private String notes;
}
