import {
  andIClickContinue,
  andIType,
  givenIHaveACookieSetAndIVisit,
  givenIHaveSignedIn,
  iCanClickTheBackLinkToGoToPreviousPage,
  requiredFieldErrorMessage,
  thenIShouldSeeAnErrorMessageThatContains,
  thenIShouldSeeAnErrorSummaryLinkThatContains,
  thenMyFocusMovesTo,
  thenTheUrlShouldContain,
  whenIClickContinue,
  whenIClickOnTheErrorSummaryLinkContaining,
  whenIType,
} from "../common/selectors-and-assertions.spec";

describe("As a beacon owner I can enter my address so I will receive physical evidence of my registration", () => {
  const thisPageUrl = "/register-a-beacon/beacon-owner-address";
  const nextPageUrl = "/register-a-beacon/emergency-contact";
  const previousPageUrl = "/register-a-beacon/about-beacon-owner";

  const beaconOwnerAddressLine1Selector = "#ownerAddressLine1";
  const beaconOwnerTownOrCitySelector = "#ownerTownOrCity";
  const beaconOwnerPostcodeSelector = "#ownerPostcode";

  beforeEach(() => {
    givenIHaveSignedIn();
    givenIHaveACookieSetAndIVisit(thisPageUrl);
  });

  it("requires at least one character in the Address Line One field", () => {
    const expectedErrorMessage = [
      "Address line one (building number and street name)",
      requiredFieldErrorMessage,
    ];

    whenIType(" ", beaconOwnerAddressLine1Selector);
    andIClickContinue();

    thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
    thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);

    whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
    thenMyFocusMovesTo(beaconOwnerAddressLine1Selector);
  });

  it("requires at least one character in the Town or city field", () => {
    const expectedErrorMessage = ["Town or city", requiredFieldErrorMessage];

    whenIType(" ", beaconOwnerTownOrCitySelector);
    andIClickContinue();

    thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
    thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);

    whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
    thenMyFocusMovesTo(beaconOwnerTownOrCitySelector);
  });

  it("requires at least one character in the Postcode field", () => {
    const expectedErrorMessage = ["Postcode", requiredFieldErrorMessage];

    whenIType(" ", beaconOwnerPostcodeSelector);
    andIClickContinue();

    thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
    thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);

    whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
    thenMyFocusMovesTo(beaconOwnerPostcodeSelector);
  });

  it("requires the Postcode to be in the UK postcode format", () => {
    const expectedErrorMessage = ["Postcode", "valid UK postcode"];

    whenIType("Not a valid UK postcode", beaconOwnerPostcodeSelector);
    andIClickContinue();

    thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
    thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);

    whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
    thenMyFocusMovesTo(beaconOwnerPostcodeSelector);
  });

  it("routes to the next page if there are no errors with the form submission", () => {
    whenIType("1 Admiralty Square", beaconOwnerAddressLine1Selector);
    andIType("Portsmouth", beaconOwnerTownOrCitySelector);
    andIType("PO1 3NJ", beaconOwnerPostcodeSelector);

    whenIClickContinue();

    thenTheUrlShouldContain(nextPageUrl);
  });

  it("links to the previous page via a back button", () => {
    iCanClickTheBackLinkToGoToPreviousPage(previousPageUrl);
  });
});
