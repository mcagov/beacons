package uk.gov.mca.beacons.api.legacybeacon.rest.dto;

import javax.validation.Valid;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateRecoveryEmailDTO {

  @Valid
  public String recoveryEmail;
}
