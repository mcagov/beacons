import { isValidUse } from "../../../src/lib/helpers/isValidUse";
import { DraftBeaconUse } from "../../../src/entities/DraftBeaconUse";

describe("isValidUse", () => {
  it("returns true for a valid beacon", () => {
    const maritimeInput: DraftBeaconUse = {
      environment: "MARITIME",
      purpose: "COMMERCIAL",
      activity: "FISHING",
      moreDetails: "More info",
      mainUse: true,
    };

    const aviationInput: DraftBeaconUse = {
      environment: "AVIATION",
      purpose: "COMMERCIAL",
      activity: "JET",
      moreDetails: "More info",
      mainUse: true,
    };

    const landInput: DraftBeaconUse = {
      environment: "LAND",
      activity: "CYCLING",
      moreDetails: "More info",
      mainUse: true,
    };

    const maritimeResponse = isValidUse(maritimeInput);
    const aviationResponse = isValidUse(aviationInput);
    const landResponse = isValidUse(landInput);

    expect(maritimeResponse).toBeTruthy();
    expect(aviationResponse).toBeTruthy();
    expect(landResponse).toBeTruthy();
  });

  it("returns false for an invalid beacon", () => {
    const maritimeInput: DraftBeaconUse = {
      environment: "MARITIME",
      activity: "FISHING",
      moreDetails: "More info",
      mainUse: true,
    };

    const aviationInput: DraftBeaconUse = {
      environment: "AVIATION",
      activity: "JET",
      moreDetails: "More info",
      mainUse: true,
    };

    const landInput: DraftBeaconUse = {
      environment: "LAND",
      moreDetails: "More info",
      mainUse: true,
    };

    const emptyInput: DraftBeaconUse = {
      environment: "",
      activity: "",
      moreDetails: "",
    };

    const maritimeResponse = isValidUse(maritimeInput);
    const aviationResponse = isValidUse(aviationInput);
    const landResponse = isValidUse(landInput);
    const emptyResponse = isValidUse(emptyInput);

    expect(maritimeResponse).toBeFalsy();
    expect(aviationResponse).toBeFalsy();
    expect(landResponse).toBeFalsy();
    expect(emptyResponse).toBeFalsy();
  });

  it("returns false for a beacon missing moreDetails property", () => {
    const maritimeInput: DraftBeaconUse = {
      environment: "MARITIME",
      purpose: "COMMERCIAL",
      activity: "FISHING",
      mainUse: true,
    };

    const aviationInput: DraftBeaconUse = {
      environment: "AVIATION",
      purpose: "COMMERCIAL",
      activity: "JET",
      mainUse: true,
    };

    const landInput: DraftBeaconUse = {
      environment: "LAND",
      activity: "CYCLING",
      mainUse: true,
    };

    const maritimeResponse = isValidUse(maritimeInput);
    const aviationResponse = isValidUse(aviationInput);
    const landResponse = isValidUse(landInput);

    expect(maritimeResponse).toBeFalsy();
    expect(aviationResponse).toBeFalsy();
    expect(landResponse).toBeFalsy();
  });

  it("returns true for a valid land beacon used at a wind farm", () => {
    const input: DraftBeaconUse = {
      environment: "LAND",
      activity: "WINDFARM",
      windfarmLocation: "Devon",
      moreDetails: "More info",
      mainUse: true,
    };

    const response = isValidUse(input);

    expect(response).toBeTruthy();
  });

  it("returns false for an invalid land beacon used at a wind farm missing windfarmLocation property", () => {
    const input: DraftBeaconUse = {
      environment: "LAND",
      activity: "WINDFARM",
      moreDetails: "More info",
      mainUse: true,
    };

    const response = isValidUse(input);

    expect(response).toBeFalsy();
  });

  it("returns true for a valid land beacon used for remote work", () => {
    const input: DraftBeaconUse = {
      environment: "LAND",
      activity: "WORKING_REMOTELY",
      workingRemotelyLocation: "Devon",
      moreDetails: "More info",
      mainUse: true,
    };

    const response = isValidUse(input);

    expect(response).toBeTruthy();
  });

  it("returns false for an invalid land beacon used for remote work missing workingRemotelyLocation property", () => {
    const input: DraftBeaconUse = {
      environment: "LAND",
      activity: "WORKING_REMOTELY",
      moreDetails: "More info",
      mainUse: true,
    };

    const response = isValidUse(input);

    expect(response).toBeFalsy();
  });

  it("returns true for a valid land beacon with other activity", () => {
    const input: DraftBeaconUse = {
      environment: "LAND",
      activity: "OTHER",
      otherActivityText: "Other description",
      otherActivityLocation: "Devon",
      moreDetails: "More info",
      mainUse: true,
    };

    const response = isValidUse(input);

    expect(response).toBeTruthy();
  });

  it("returns false for an invalid land beacon with other activity missing otherActivityText and otherActivityLocation properties", () => {
    const input: DraftBeaconUse = {
      environment: "LAND",
      activity: "OTHER",
      moreDetails: "More info",
      mainUse: true,
    };

    const response = isValidUse(input);

    expect(response).toBeFalsy();
  });

  it("returns false for an invalid land beacon with other activity and missing otherActivityText property", () => {
    const input: DraftBeaconUse = {
      environment: "LAND",
      activity: "OTHER",
      moreDetails: "More info",
      otherActivityLocation: "Devon",
      mainUse: true,
    };

    const response = isValidUse(input);

    expect(response).toBeFalsy();
  });

  it("returns false for an invalid land beacon with other activity and missing otherActivityLocation property", () => {
    const input: DraftBeaconUse = {
      environment: "LAND",
      activity: "OTHER",
      moreDetails: "More info",
      otherActivityText: "Other description",
      mainUse: true,
    };

    const response = isValidUse(input);

    expect(response).toBeFalsy();
  });

  it("returns true for valid maritime and aviation beacons with other activity", () => {
    const maritimeInput: DraftBeaconUse = {
      environment: "MARITIME",
      purpose: "COMMERCIAL",
      activity: "OTHER",
      otherActivityText: "Info",
      moreDetails: "More info",
      mainUse: true,
    };

    const aviationInput: DraftBeaconUse = {
      environment: "AVIATION",
      purpose: "COMMERCIAL",
      activity: "OTHER",
      otherActivityText: "Info",
      moreDetails: "More info",
      mainUse: true,
    };

    const maritimeResponse = isValidUse(maritimeInput);
    const aviationResponse = isValidUse(aviationInput);

    expect(maritimeResponse).toBeTruthy();
    expect(aviationResponse).toBeTruthy();
  });

  it("returns false for invalid maritime and aviation beacons with other activity missing otherActivityText property", () => {
    const maritimeInput: DraftBeaconUse = {
      environment: "MARITIME",
      activity: "OTHER",
      purpose: "COMMERCIAL",
      moreDetails: "More info",
      mainUse: true,
    };

    const aviationInput: DraftBeaconUse = {
      environment: "AVIATION",
      activity: "OTHER",
      purpose: "COMMERCIAL",
      moreDetails: "More info",
      mainUse: true,
    };

    const maritimeResponse = isValidUse(maritimeInput);
    const aviationResponse = isValidUse(aviationInput);

    expect(maritimeResponse).toBeFalsy();
    expect(aviationResponse).toBeFalsy();
  });
});
