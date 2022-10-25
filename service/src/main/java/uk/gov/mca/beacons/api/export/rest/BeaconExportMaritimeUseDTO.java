package uk.gov.mca.beacons.api.export.rest;

import javax.validation.Valid;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BeaconExportMaritimeUseDTO extends BeaconExportUseDTO {

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
  private String radioSystem;

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
  private String rssAndSsrNumber;

  @Valid
  private String hullIdNumber;

  @Valid
  private String coastguardCGRefNumber;

  @Valid
  private String areaOfOperation;
}
