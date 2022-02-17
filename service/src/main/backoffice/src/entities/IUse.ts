export interface IUse {
  id: string;
  environment: Environments;
  purpose?: string;
  activity: string;
  otherActivity?: string;
  callSign?: string;
  vhfRadio?: boolean;
  fixedVhfRadio?: boolean;
  fixedVhfRadioValue?: string;
  portableVhfRadio?: boolean;
  portableVhfRadioValue?: string;
  satelliteTelephone?: boolean;
  satelliteTelephoneValue?: string;
  mobileTelephone?: boolean;
  mobileTelephone1?: string;
  mobileTelephone2?: string;
  otherCommunication?: boolean;
  otherCommunicationValue?: string;
  maxCapacity?: number;
  vesselName?: string;
  portLetterNumber?: string;
  homeport?: string;
  areaOfOperation?: string;
  beaconLocation?: string;
  imoNumber?: string;
  ssrNumber?: string;
  rssNumber?: string;
  officialNumber?: string;
  rigPlatformLocation?: string;
  aircraftManufacturer?: string;
  principalAirport?: string;
  secondaryAirport?: string;
  registrationMark?: string;
  hexAddress?: string;
  cnOrMsnNumber?: string;
  dongle?: boolean;
  beaconPosition?: string;
  workingRemotelyLocation?: string;
  workingRemotelyPeopleCount?: number;
  windfarmLocation?: string;
  windfarmPeopleCount?: string;
  otherActivityLocation?: string;
  otherActivityPeopleCount?: string;
  moreDetails: string;
  mainUse: boolean;
}

export enum Environments {
  Maritime = "MARITIME",
  Aviation = "AVIATION",
  Land = "LAND",
}

export enum Purposes {
  Commercial = "COMMERCIAL",
  Pleasure = "PLEASURE",
}

export enum Activities {
  FishingVessel = "FISHING_VESSEL",
  ClimbingMountaineering = "CLIMBING_MOUNTAINEERING",
  Glider = "GLIDER",
  SailingVessel = "SAILING_VESSEL",
  Other = "OTHER",
  WorkingRemotely = "WORKING_REMOTELY",
  Windfarm = "WINDFARM",
}
