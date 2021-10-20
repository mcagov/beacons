import { v4 } from "uuid";

export const requiredFieldErrorMessage = "required field";
export const tooManyCharactersErrorMessage = "too many characters";

export const iCanClickTheBackLinkToGoToPreviousPage = (
  previousPageURL: string
): void => {
  cy.get(".govuk-back-link").click();
  thenTheUrlShouldContain(previousPageURL);
};

export const theBackLinkGoesTo = (previousPageUrl: string): void => {
  cy.get(".govuk-back-link")
    .should("have.attr", "href")
    .and("match", new RegExp(previousPageUrl, "i"));
};

export const theBackLinkContains = (...strings: string[]): void => {
  strings.forEach((s) => {
    cy.get(".govuk-back-link")
      .should("have.attr", "href")
      .and("match", new RegExp(s, "i"));
  });
};

export const givenIHaveACookieSetAndIVisit = (url: string): void => {
  cy.setCookie("submissionId", v4());
  cy.visit(url);
};

export const ifIAmAskedForAccountHolderDetailsIProvideThem = (): void => {
  cy.get("h1").then(($heading) => {
    if ($heading.text().includes("Do you live in the United Kingdom?")) {
      whenISelect("#unitedKingdom");
      andIClickContinue();
    }
  });

  cy.get("h1").then(($heading) => {
    if ($heading.text().includes("Update your details")) {
      whenIType("Mrs Beacon", "#fullName");
      whenIType("+447713812659", "#telephoneNumber");
      whenIType("100 Beacons Road", "#addressLine1");
      whenIType("Beacons", "#townOrCity");
      whenIType("BS8 9DB", "#postcode");
      whenIClickTheButtonContaining("Save these account details");
    }
  });
};

export const givenIHaveACookieSetAndHaveSignedInIVisit = (
  url: string
): void => {
  givenIHaveACookieSetAndHaveSignedIn();
  cy.visit(url);
  ifIAmAskedForAccountHolderDetailsIProvideThem();
};

export const givenIHaveACookieSetAndHaveSignedIn = (): void => {
  cy.setCookie("submissionId", v4());
  givenIHaveSignedIn();
};

export const givenIHaveSignedIn = (): void => {
  cy.setCookie("next-auth.session-token", Cypress.env("SESSION_TOKEN"), {
    log: false,
  });
};

export const givenIHaveNotSignedIn = (): void => {
  cy.clearCookie("next-auth.session-token");
};

export const givenIHaveVisited = (url: string): void => {
  cy.visit(url);
};

export const givenIHaveBeenTo = givenIHaveVisited;
export const whenIHaveVisited = givenIHaveVisited;
export const andIHaveVisited = givenIHaveVisited;
export const iHaveVisited = givenIHaveVisited;

export const iCanSeeAPageHeadingThatContains = (text: string): void => {
  cy.get("h1").contains(text);
};

export const iCanSeeASectionHeadingThatContains = (text: string): void => {
  cy.get("h2").contains(text);
};

export const iCanSeeNLinksContaining = (n: number, text: string): void => {
  cy.get(`a[href]:contains(${text})`).should("have.length", n);
};

export const iCanSeeAButtonContaining = (text: string | RegExp): void => {
  cy.get(`button:contains(${text}),[role=button]:contains(${text})`);
};

export const givenIHaveClickedTheButtonContaining = (text: string): void => {
  cy.get(`button:contains(${text}),[role=button]:contains(${text})`).click();
};

export const andIClickTheButtonContaining =
  givenIHaveClickedTheButtonContaining;

export const whenIClickTheButtonContaining =
  givenIHaveClickedTheButtonContaining;

export const whenIClickContinue = (): void => {
  givenIHaveClickedTheButtonContaining("Continue");
};

export const andIClickContinue = whenIClickContinue;
export const givenIHaveClickedContinue = whenIClickContinue;

export const givenIHaveClicked = (selector: string): void => {
  cy.get(selector).click();
};

export const whenIClickOnTheErrorSummaryLinkContaining = (
  ...strings: string[]
): void => {
  let link = cy.get(".govuk-error-summary__list");
  strings.forEach((string) => (link = link.contains(string)));
  link.click();
};

export const whenIType = (value: string, selector: string): void => {
  cy.get(selector).should("be.empty").type(value);
};

export const whenIClearAndType = (value: string, selector: string): void => {
  cy.get(selector).clear().type(value);
};

export const givenIHaveTyped = whenIType;
export const andIType = whenIType;

export const whenIClearTheInput = (selector: string): void => {
  cy.get(selector).clear();
};

export const givenIHaveClearedTheInput = whenIClearTheInput;

export const thenTheUrlShouldContain = (urlPath: string): void => {
  cy.url().should("include", urlPath);
};

export const thenTheUrlPathShouldBe = (urlPath: string): void => {
  cy.url().should("include", Cypress.config().baseUrl + urlPath);
};

export const thenTheInputShouldOnlyContain = (
  expectedValue: string,
  selector: string
): void => {
  cy.get(selector).should("have.value", expectedValue);
};

export const thenTheInputShouldBeEmpty = (selector: string): void => {
  thenTheInputShouldOnlyContain("", selector);
};

export const thenTheDropdownShouldHaveTheFirstOptionSelected = (
  selector: string
): void => {
  cy.get(selector)
    .children()
    .first()
    .then((option1) => {
      expect(option1).to.be.selected;
    });
};

export const thenIShouldSeeAnErrorSummaryLinkThatContains = (
  ...strings: string[]
): void => {
  cy.get(".govuk-error-summary__list").within(() => {
    strings.every((string) => cy.get("a").should("contain", string));
  });
};

export const thenIShouldSeeAnErrorMessageThatContains = (
  ...strings: string[]
): void => {
  strings.every((string) =>
    cy.get(".govuk-error-message").should("contain", string)
  );
};

export const thenIShouldSeeFormErrors = (...errorMessages: string[]): void => {
  thenIShouldSeeAnErrorSummaryLinkThatContains(...errorMessages);
  thenIShouldSeeAnErrorMessageThatContains(...errorMessages);
};

export const thenMyFocusMovesTo = (selector: string): void => {
  cy.get(selector).should("be.focused");
};

export const givenIHaveSelected = (selector: string): void => {
  cy.get(selector).should("not.be.checked").check();
};
export const andIHaveSelected = givenIHaveSelected;
export const whenISelect = givenIHaveSelected;

export const givenIHaveUnselected = (selector: string): void => {
  cy.get(selector).should("be.checked").uncheck();
};

export const givenIHaveWaitedForAzureB2C = (): void => {
  cy.wait(1000);
};

/**
 *
 * Performs an operation and ensures a new page has loaded before continuing.
 *
 * Will continue as soon as a new page is loaded, up to the maximum timout
 * set in @param maxTimeoutMs.
 *
 * Will fail if maxTimeoutMs is exceeded.
 *
 * @param operation - A callback function to perform
 * @param maxTimeoutMs - Max time to wait in ms
 */
export const iPerformOperationAndWaitForNewPageToLoad = (
  operation: () => void,
  maxTimeoutMs = 20000
): void => {
  cy.location().then((previousPage) => {
    operation();
    cy.location("pathname", { timeout: maxTimeoutMs }).should(
      "not.equal",
      previousPage.pathname
    );
  });
};

export const andIHaveEnteredNoInformation = (): void => null;

export const whenIClickBack = (): void => {
  cy.get(".govuk-back-link").click();
};

export const whenIClickBackTimes = (times: number): void => {
  for (let i = 0; i < times; i++) {
    whenIClickBack();
  }
};

export const thenTheCheckboxShouldBeChecked = (selector: string): void => {
  cy.get(selector).should("be.checked");
};

export const thenTheRadioButtonShouldBeSelected =
  thenTheCheckboxShouldBeChecked;

export const iCannotSee = (selector: string): void => {
  cy.get(selector).should("not.exist");
};

export const thenICannotSee = iCannotSee;

export const thenICanSeeAnInputWithPlaceholder = (
  inputId: string,
  placeholderText: string
): void => {
  cy.get(inputId).should("have.attr", "placeholder", placeholderText);
};

export const thenThereAreNoErrors = (): void => {
  thenICannotSee(".govuk-error-summary");
  thenICannotSee(".govuk-error-message");
};

export const iCanEditAFieldContaining = (value: string): void => {
  cy.get(`input[value="${value}"]`);
};
export const iHaveClickedOnAGivenLink = (href: string): void => {
  cy.get(`a[href="${href}"]`).click();
};

export const iHaveClickedOnALinkWithText = (text: string): void => {
  cy.get(`a[href]:contains(${text})`).click();
};

export const whenIClickTheLinkThatContains = iHaveClickedOnALinkWithText;

export const iCanSeeTheBeaconHexIdThatIsAssociatedWithMyEmailAddress = (
  hexId: string
): void => {
  cy.contains(hexId);
};

export const iCanSeeText = (pattern: string | RegExp): void => {
  cy.get("main").contains(pattern);
};

export const iCannotSeeText = (text: string | RegExp): void => {
  cy.get("main").should("not.contain", text);
};

export const whenIClickTheActionLinkInATableRowContaining = (
  pattern: string | RegExp,
  actionLinkText: string | RegExp
): void => {
  cy.get("main")
    .contains(pattern)
    .parent()
    .parent()
    .contains(actionLinkText)
    .click();
};

export const whenISelectTheOptionFromTheDropdown = (
  option: string,
  selector: string
): void => {
  cy.get(selector).select(option);
};

export const whenIClickTheBrowserBackButton = (): void => {
  cy.go("back");
};
