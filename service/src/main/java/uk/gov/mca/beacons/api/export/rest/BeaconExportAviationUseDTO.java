package uk.gov.mca.beacons.api.export.rest;

import javax.validation.Valid;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
public class BeaconExportAviationUseDTO extends BeaconExportUseDTO {

  @Valid
  private String aircraftType;

  @Valid
  private String aircraftModel;

  @Valid
  private String aircraftManufacturer;

  @Valid
  private int maxPersonOnBoard;

  @Valid
  private String aircraftRegistrationMark;

  @Valid
  private String twentyFourBitAddressInHex;

  @Valid
  private String aodSerialNumber;

  @Valid
  private String principalAirport;

  @Valid
  private String secondaryAirport;

  @Valid
  private String isDongle;

  @Valid
  private String aircraftOperatorsDesignatorAndSerialNo;

  @Valid
  private String coreSerialNumber;
}
