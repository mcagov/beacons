package uk.gov.mca.beacons.api.export.rest;

import javax.validation.Valid;

public abstract class BeaconExportUseDTO {

  String environment;
  String notes;

  public String getEnvironment() {
    return environment;
  }
}
