export const ofcomLicenseUrl =
  "https://www.ofcom.org.uk/manage-your-licence/radiocommunication-licences/ships-radio";

export type ExistingPageURLs =
  | AccountPageURLs
  | GeneralPageURLs
  | ErrorPageURLs
  | DeleteRegistrationPageURLs
  | CreateRegistrationPageURLs
  | UpdatePageURLs
  | ActionURLs;

export enum AccountPageURLs {
  signUpOrSignIn = "/account/sign-up-or-sign-in",
  signUp = "/account/sign-up",
  signIn = "/account/sign-in",
  signOut = "/account/sign-out",
  accountHome = "/account/your-beacon-registry-account",
  updateAccount = "/account/update-account",
  updateAccountUnitedKingdom = "/account/update-account/united-kingdom",
  updateAccountRestOfWorld = "/account/update-account/rest-of-world",
}

export enum ClaimPageURLs {
  claimBeacon = "/manage-my-registrations/claim-legacy-beacon",
}

export enum GeneralPageURLs {
  start = "/",
  areYouSure = "/are-you-sure",
}

export enum ErrorPageURLs {
  serverError = "/500",
  unauthenticated = "/unauthenticated",
}

export enum DeleteRegistrationPageURLs {
  deleteRegistration = "/manage-my-registrations/delete",
  deleteRegistrationSuccess = "/manage-my-registrations/delete/success",
  deleteRegistrationFailure = "/manage-my-registrations/delete/failure",
}

export enum CreateRegistrationPageURLs {
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
  beaconOwnerAddressUnitedKingdom = "/register-a-beacon/beacon-owner-address/united-kingdom",
  beaconOwnerAddressRestOfWorld = "/register-a-beacon/beacon-owner-address/rest-of-world",
  emergencyContact = "/register-a-beacon/emergency-contact",
  checkYourAnswers = "/register-a-beacon/check-your-answers",
  applicationComplete = "/register-a-beacon/application-complete",
}

export enum UpdatePageURLs {
  registrationSummary = "/manage-my-registrations/update/",
  beaconDetails = "/manage-my-registrations/update/details/",
  beaconInformation = "/manage-my-registrations/update/beacon-information/",
  usesSummary = "/manage-my-registrations/update/use/summary",
  environment = "/manage-my-registrations/update/use/environment",
  purpose = "/manage-my-registrations/update/use/purpose",
  activity = "/manage-my-registrations/update/use/activity",
  aboutTheVessel = "/manage-my-registrations/update/use/about-the-vessel",
  vesselCommunications = "/manage-my-registrations/update/use/vessel-communications",
  aboutTheAircraft = "/manage-my-registrations/update/use/about-the-aircraft",
  aircraftCommunications = "/manage-my-registrations/update/use/aircraft-communications",
  landCommunications = "/manage-my-registrations/update/use/land-communications",
  moreDetails = "/manage-my-registrations/update/use/more-details",
  aboutBeaconOwner = "/manage-my-registrations/update/about-beacon-owner",
  beaconOwnerAddress = "/manage-my-registrations/update/beacon-owner-address",
  emergencyContact = "/manage-my-registrations/update/emergency-contact",
  updateComplete = "/manage-my-registrations/update/complete",
}

export enum ActionURLs {
  clearAndCheckBeaconDetails = "/api/registration/clear-and-check-beacon-details",
  deleteCachedUse = "/api/registration/delete-use",
  addNewUseToDraftRegistration = "/api/registration/add-new-use-to-draft",
  mainCachedUseMain = "/api/registration/make-use-main",
}

export enum FeedbackURLs {
  feedback = "/feedback",
  success = "/feedback/success",
  failure = "/feedback/failure",
}

export const queryParams = (queryParams: Record<string, any>): string =>
  "?" + new URLSearchParams(queryParams).toString();
