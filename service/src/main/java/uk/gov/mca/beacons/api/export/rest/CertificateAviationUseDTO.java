package uk.gov.mca.beacons.api.export.rest;

import javax.validation.Valid;
import lombok.*;
import uk.gov.mca.beacons.api.beaconuse.domain.Environment;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CertificateAviationUseDTO extends CertificateUseDTO {

  @Valid
  private String environment;

  @Valid
  private String aircraftType;

  @Valid
  private int maxPersonOnBoard;

  @Valid
  private String aircraftRegistrationMark;

  @Valid
  private String TwentyFourBitAddressInHex;

  @Valid
  private String principalAirport;

  @Valid
  private String radioSystem;

  @Valid
  private String aircraftOperatorsDesignatorAndSerialNo;

  @Valid
  //Only used for legacy
  private String notes;
}
