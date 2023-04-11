package uk.gov.mca.beacons.api.export.rest;

import javax.validation.Valid;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
public class BeaconExportRigUseDTO extends BeaconExportUseDTO {

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
  private String areaOfOperation;
}
