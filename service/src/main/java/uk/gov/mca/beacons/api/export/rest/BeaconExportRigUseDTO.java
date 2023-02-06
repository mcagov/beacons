package uk.gov.mca.beacons.api.export.rest;

import java.util.Map;
import javax.validation.Valid;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BeaconExportRigUseDTO extends BeaconExportUseDTO {

  @Valid
  private String environment;

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
  private String rigName;

  @Valid
  private String homePort;

  @Valid
  private int maxPersonOnBoard;

  @Valid
  private String vesselCallsign;

  @Valid
  private String mmsiNumber;

  @Valid
  private String imoNumber;

  @Valid
  private Map<String, String> radioSystems;

  @Valid
  //Only used for legacy
  private String notes;

  @Valid
  private String areaOfOperation;

  @Valid
  private String nsn;

  @Valid
  private String beaconPartNumber;

  @Valid
  private String pennantNumber;

  @Valid
  private String aircraftDescription;

  @Valid
  private String survivalCraftType;
}
