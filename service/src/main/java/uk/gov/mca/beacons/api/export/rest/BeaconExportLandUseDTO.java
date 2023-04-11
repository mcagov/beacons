package uk.gov.mca.beacons.api.export.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import javax.validation.Valid;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
public class BeaconExportLandUseDTO extends BeaconExportUseDTO {

  @Valid
  private String windfarmLocation;

  @Valid
  private String workingRemotelyLocation;

  @Valid
  private String otherActivityLocation;

  @Valid
  private String descriptionOfIntendedUse;

  @Valid
  private String windfarmPeopleCount;

  @Valid
  private String workingRemotelyPeopleCount;

  @Valid
  private String otherActivityPeopleCount;

  @Valid
  private int numberOfPersonsOnBoard;

  @Valid
  private String areaOfUse;

  @Valid
  private String tripInformation;
}
