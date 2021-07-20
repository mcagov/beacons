export const ofcomLicenseUrl =
  "https://www.ofcom.org.uk/manage-your-licence/radiocommunication-licences/ships-radio";

export enum PageURLs {
  start = "/",
  signUpOrSignIn = "/account/sign-up-or-sign-in",
  signUp = "/account/sign-up",
  signIn = "/account/sign-in",
  accountHome = "/account/your-beacon-registry-account",
  areYouSure = "/are-you-sure",
  checkBeaconDetails = "/register-a-beacon/check-beacon-details",
  beaconInformation = "/register-a-beacon/beacon-information",
  environment = "/register-a-beacon/beacon-use",
  purpose = "/register-a-beacon/purpose",
  activity = "/register-a-beacon/activity",
  aboutTheVessel = "/register-a-beacon/about-the-vessel",
  aboutTheAircraft = "/register-a-beacon/about-the-aircraft",
  vesselCommunications = "/register-a-beacon/vessel-communications",
  aircraftCommunications = "/register-a-beacon/aircraft-communications",
  landCommunications = "/register-a-beacon/land-communications",
  moreDetails = "/register-a-beacon/more-details",
  additionalUse = "/register-a-beacon/additional-beacon-use",
  aboutBeaconOwner = "/register-a-beacon/about-beacon-owner",
  beaconOwnerAddress = "/register-a-beacon/beacon-owner-address",
  emergencyContact = "/register-a-beacon/emergency-contact",
  checkYourAnswers = "/register-a-beacon/check-your-answers",
  applicationComplete = "/register-a-beacon/application-complete",
  serverError = "/500",
}

export enum ActionURLs {
  deleteCachedUse = "/api/registration/delete-use",
  createNewCachedUse = "/api/registration/create-use",
}

export function formatUrlQueryParams(
  url: string,
  queryParamMap: Record<string, any>
): string {
  const formatUrl = (queryParam, value) => {
    if (!url.includes(queryParam)) {
      const queryStringCombiner = url.includes("?") ? "&" : "?";
      url = `${url}${queryStringCombiner}${queryParam}=${value}`;
    }
  };

  Object.keys(queryParamMap).forEach((queryParam) => {
    const value = queryParamMap[queryParam];
    formatUrl(queryParam, value);
  });

  return url;
}

export const queryParams = (queryParams: Record<string, any>): string =>
  "?" + new URLSearchParams(queryParams).toString();
