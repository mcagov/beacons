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
public class BeaconExportAviationUseDTO extends BeaconExportUseDTO {

  @Valid
  private String environment;

  @Valid
  private String typeOfUse;

  @Valid
  private String beaconPosition;

  @Valid
  private String beaconLocation;

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
  private Map<String, String> radioSystems;

  @Valid
  private String aircraftOperatorsDesignatorAndSerialNo;

  @Valid
  private String coreSerialNumber;

  @Valid
  //Only used for legacy
  private String notes;
}
