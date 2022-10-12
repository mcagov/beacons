package uk.gov.mca.beacons.api.export.rest;

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
  private String descriptionOfIntendedUse;

  @Valid
  private int numberOfPersonsOnBoard;

  @Valid
  private String areaOfUse;

  @Valid
  private String tripInformation;

  @Valid
  private String radioSystem;

  @Valid
  //Only used for legacy
  private String notes;
}
