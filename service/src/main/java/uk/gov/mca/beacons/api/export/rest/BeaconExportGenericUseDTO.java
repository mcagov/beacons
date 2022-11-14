package uk.gov.mca.beacons.api.export.rest;

import java.util.Map;
import javax.validation.Valid;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BeaconExportGenericUseDTO extends BeaconExportUseDTO {

  @Valid
  private String environment;

  @Valid
  private String vesselName;

  @Valid
  private String homePort;

  @Valid
  private String vessel;

  @Valid
  private int maxPersonOnBoard;

  @Valid
  private String vesselCallsign;

  @Valid
  private String mmsiNumber;

  @Valid
  private Map<String, String> radioSystems;

  @Valid
  //Only used for legacy
  private String notes;

  @Valid
  private String fishingVesselPortIdAndNumbers;

  @Valid
  private String officialNumber;

  @Valid
  private String imoNumber;

  @Valid
  private String areaOfOperation;

  @Valid
  private String rssAndSsrNumber;

  @Valid
  private String hullIdNumber;

  @Valid
  private String coastguardCGRefNumber;

  @Valid
  private String aircraftType;

  @Valid
  private String aircraftRegistrationMark;

  @Valid
  private String TwentyFourBitAddressInHex;

  @Valid
  private boolean isDongle = false;

  @Valid
  private String principalAirport;

  @Valid
  private String secondaryAirport;

  @Valid
  private String aircraftOperatorsDesignatorAndSerialNo;

  @Valid
  private String descriptionOfIntendedUse;

  @Valid
  private int numberOfPersonsOnBoard;

  @Valid
  private String areaOfUse;

  @Valid
  private String tripInformation;
}
