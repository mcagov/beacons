package uk.gov.mca.beacons.api.export.rest;

import uk.gov.mca.beacons.api.beaconuse.domain.Environment;

public abstract class CertificateUseDTO {

  Environment environment;
  String notes;
}
