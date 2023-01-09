package uk.gov.mca.beacons.api.export.rest;

import java.util.List;
import java.util.UUID;
import lombok.*;

public abstract class BeaconExportUseDTO {

  String environment;
  String notes;

  public String getEnvironment() {
    return environment;
  }
}
