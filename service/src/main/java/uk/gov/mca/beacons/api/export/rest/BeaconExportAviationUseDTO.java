package uk.gov.mca.beacons.api.export.rest;

import javax.validation.Valid;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BeaconExportAviationUseDTO extends BeaconExportUseDTO {

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
  private String secondaryAirport;

  @Valid
  private String radioSystem;

  @Valid
  private String aircraftOperatorsDesignatorAndSerialNo;

  @Valid
  //Only used for legacy
  private String notes;
}
