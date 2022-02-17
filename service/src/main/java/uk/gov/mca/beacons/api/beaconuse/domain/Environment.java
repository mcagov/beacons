package uk.gov.mca.beacons.api.beaconuse.domain;

/**
 * An enumeration of the possible environments a beacon can be used in.
 * TODO: Replace with abstract BeaconUse with classes such as MaritimeUse inheriting from BeaconUse
 */
public enum Environment {
  MARITIME,
  AVIATION,
  LAND,
}
