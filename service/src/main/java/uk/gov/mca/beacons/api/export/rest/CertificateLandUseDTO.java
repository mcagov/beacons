package uk.gov.mca.beacons.api.export.rest;

import javax.validation.Valid;
import lombok.*;
import uk.gov.mca.beacons.api.beaconuse.domain.Environment;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CertificateLandUseDTO extends CertificateUseDTO {

  @Valid
  private final Environment environment = Environment.LAND;

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
