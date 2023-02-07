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
  private String rigName;

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
  private String homePort;

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
  private String aircraftModel;

  @Valid
  private String aircraftManufacturer;

  @Valid
  private String coreSerialNumber;

  @Valid
  private String twentyFourBitAddressInHex;

  @Valid
  private String aodSerialNumber;

  @Valid
  private boolean isDongle;

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
