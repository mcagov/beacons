package uk.gov.mca.beacons.api.beaconuse.domain;

/**
 * An enumeration of the possible activities that a beacon could be used for.
 * TODO: Consider how to replace with something other than an enum.
 */
public enum Activity {
  // Maritime
  SAILING,
  MOTOR,
  ROWING,
  SMALL_UNPOWERED,
  FISHING_VESSEL,
  MERCHANT_VESSEL,
  FLOATING_PLATFORM,
  OFFSHORE_WINDFARM,
  OFFSHORE_RIG_PLATFORM,

  // Aviation
  JET_AIRCRAFT,
  LIGHT_AIRCRAFT,
  GLIDER,
  HOT_AIR_BALLOON,
  ROTOR_CRAFT,
  PASSENGER_PLANE,
  CARGO_AIRPLANE,

  // Land/other
  DRIVING,
  CYCLING,
  CLIMBING_MOUNTAINEERING,
  SKIING,
  WALKING_HIKING,
  WORKING_REMOTELY,
  WINDFARM,

  OTHER,
}
