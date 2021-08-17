import { PageURLs } from "../../../src/lib/urls";
import {
  andIClickContinue,
  givenIHaveACookieSetAndIVisit,
  givenIHaveSelected,
  requiredFieldErrorMessage,
  thenIShouldSeeAnErrorMessageThatContains,
  thenIShouldSeeAnErrorSummaryLinkThatContains,
  thenIShouldSeeFormErrors,
  thenMyFocusMovesTo,
  whenIClickContinue,
  whenIClickOnTheErrorSummaryLinkContaining,
  whenIType,
} from "../common/selectors-and-assertions.spec";

describe("As a beacon owner, I want to submit the primary activity for my beacon", () => {
  const otherActivitySelector = "#other-activity";
  const otherActivityTextRequiredErrorMessage = [
    "Enter a description",
    "activity",
  ];

  beforeEach(() => {
    givenIHaveACookieSetAndIVisit(PageURLs.environment);
  });

  describe("As a maritime, pleasure owner", () => {
    beforeEach(() => {
      givenIHaveSelected("#maritime");
      andIClickContinue();
      givenIHaveSelected("#pleasure");
      andIClickContinue();
    });

    it("displays an error if no activity is selected", () => {
      whenIClickContinue();
      thenIShouldSeeFormErrors(requiredFieldErrorMessage);
      thenIShouldSeeAnErrorSummaryLinkThatContains(
        "Activity",
        requiredFieldErrorMessage
      );
      whenIClickOnTheErrorSummaryLinkContaining(requiredFieldErrorMessage);
      thenMyFocusMovesTo("#motor-vessel");
    });

    it("displays an error if 'Other activity' is selected, but no text is provided", () => {
      givenIHaveSelected(otherActivitySelector);
      whenIClickContinue();
      thenIShouldSeeFormErrors(...otherActivityTextRequiredErrorMessage);
      whenIClickOnTheErrorSummaryLinkContaining(
        ...otherActivityTextRequiredErrorMessage
      );
      thenMyFocusMovesTo("#otherActivityText");
    });
  });

  describe("As a maritime, commercial owner", () => {
    beforeEach(() => {
      givenIHaveSelected("#maritime");
      andIClickContinue();
      givenIHaveSelected("#commercial");
      andIClickContinue();
    });

    it("displays an error if no activity is selected", () => {
      whenIClickContinue();
      thenIShouldSeeFormErrors(requiredFieldErrorMessage);
      thenIShouldSeeAnErrorSummaryLinkThatContains(
        "Activity",
        requiredFieldErrorMessage
      );
      whenIClickOnTheErrorSummaryLinkContaining(requiredFieldErrorMessage);
      thenMyFocusMovesTo("#fishing-vessel");
    });

    it("displays an error if 'Other activity' is selected, but no text is provided", () => {
      givenIHaveSelected(otherActivitySelector);
      whenIClickContinue();
      thenIShouldSeeFormErrors(...otherActivityTextRequiredErrorMessage);
      whenIClickOnTheErrorSummaryLinkContaining(
        ...otherActivityTextRequiredErrorMessage
      );
      thenMyFocusMovesTo("#otherActivityText");
    });
  });

  describe("As an aviation, pleasure owner", () => {
    beforeEach(() => {
      givenIHaveSelected("#aviation");
      andIClickContinue();
      givenIHaveSelected("#pleasure");
      andIClickContinue();
    });

    it("displays an error if no activity is selected", () => {
      whenIClickContinue();
      thenIShouldSeeFormErrors(requiredFieldErrorMessage);
      thenIShouldSeeAnErrorSummaryLinkThatContains(
        "Activity",
        requiredFieldErrorMessage
      );
      whenIClickOnTheErrorSummaryLinkContaining(requiredFieldErrorMessage);
      thenMyFocusMovesTo("#jet-aircraft");
    });

    it("displays an error if 'Other activity' is selected, but no text is provided", () => {
      givenIHaveSelected(otherActivitySelector);
      whenIClickContinue();
      thenIShouldSeeFormErrors(...otherActivityTextRequiredErrorMessage);
      whenIClickOnTheErrorSummaryLinkContaining(
        ...otherActivityTextRequiredErrorMessage
      );
      thenMyFocusMovesTo("#otherActivityText");
    });
  });

  describe("As a aviation, commercial owner", () => {
    beforeEach(() => {
      givenIHaveSelected("#aviation");
      andIClickContinue();
      givenIHaveSelected("#commercial");
      andIClickContinue();
    });

    it("displays an error if no activity is selected", () => {
      whenIClickContinue();
      thenIShouldSeeFormErrors(requiredFieldErrorMessage);
      thenIShouldSeeAnErrorSummaryLinkThatContains(
        "Activity",
        requiredFieldErrorMessage
      );
      whenIClickOnTheErrorSummaryLinkContaining(requiredFieldErrorMessage);
      thenMyFocusMovesTo("#passenger-plane");
    });

    it("displays an error if 'Other activity' is selected, but no text is provided", () => {
      givenIHaveSelected(otherActivitySelector);
      whenIClickContinue();
      thenIShouldSeeFormErrors(...otherActivityTextRequiredErrorMessage);
      whenIClickOnTheErrorSummaryLinkContaining(
        ...otherActivityTextRequiredErrorMessage
      );
      thenMyFocusMovesTo("#otherActivityText");
    });
  });

  describe("As a land owner", () => {
    const workingRemotelySelector = "#working-remotely";
    const workingRemotelyLocationSelector = "#workingRemotelyLocation";
    const workingRemotelyPeopleCountSelector = "#workingRemotelyPeopleCount";
    const windfarmSelector = "#windfarm";
    const windfarmLocationSelector = "#windfarmLocation";
    const windfarmPeopleCountSelector = "#windfarmPeopleCount";
    const otherActivityTextSelector = "#otherActivityText";
    const otherActivityLocationSelector = "#otherActivityLocation";
    const otherActivityPeopleCountSelector = "#otherActivityPeopleCount";

    beforeEach(() => {
      givenIHaveSelected("#land");
      andIClickContinue();
    });

    it("displays an error if no activity is selected", () => {
      whenIClickContinue();
      thenIShouldSeeFormErrors(requiredFieldErrorMessage);
      thenIShouldSeeAnErrorSummaryLinkThatContains(
        "Activity",
        requiredFieldErrorMessage
      );
      whenIClickOnTheErrorSummaryLinkContaining(requiredFieldErrorMessage);
      thenMyFocusMovesTo("#driving");
    });

    describe("the Working remotely option", () => {
      it("requires a location if the working remotely checkbox is selected", () => {
        const expectedErrorMessage = ["Enter the location", "work remotely"];

        givenIHaveSelected(workingRemotelySelector);
        whenIType(" ", workingRemotelyLocationSelector);
        andIClickContinue();
        thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);
        whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
        thenMyFocusMovesTo(workingRemotelyLocationSelector);
      });

      it("requires a people count if the working remotely checkbox is selected", () => {
        const requiredFieldErrorMessage = [
          "Enter how many",
          "people",
          "work remotely",
        ];
        const mustBeANumberErrormessage = [
          "Enter a whole number",
          "people",
          "work remotely",
        ];

        givenIHaveSelected(workingRemotelySelector);

        whenIType(" ", workingRemotelyPeopleCountSelector);
        andIClickContinue();
        whenIClickOnTheErrorSummaryLinkContaining(...requiredFieldErrorMessage);
        thenIShouldSeeFormErrors(...requiredFieldErrorMessage);
        thenMyFocusMovesTo(workingRemotelyPeopleCountSelector);

        whenIType("not a number", workingRemotelyPeopleCountSelector);
        andIClickContinue();
        thenIShouldSeeFormErrors(...mustBeANumberErrormessage);
        whenIClickOnTheErrorSummaryLinkContaining(...mustBeANumberErrormessage);
        thenMyFocusMovesTo(workingRemotelyPeopleCountSelector);
      });
    });

    describe("the Windfarm option", () => {
      it("requires a location if the Windfarm checkbox is selected", () => {
        const expectedErrorMessage = ["Enter the location", "windfarm"];

        givenIHaveSelected(windfarmSelector);
        whenIType(" ", windfarmLocationSelector);
        andIClickContinue();
        thenIShouldSeeFormErrors(...expectedErrorMessage);
        whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
        thenMyFocusMovesTo(windfarmLocationSelector);
      });

      it("requires a people count if the Windfarm checkbox is selected", () => {
        const requiredFieldErrorMessage = [
          "Enter how many",
          "people",
          "windfarm",
        ];
        const mustBeANumberErrormessage = [
          "Enter a whole number",
          "people",
          "windfarm",
        ];

        givenIHaveSelected(windfarmSelector);

        whenIType(" ", windfarmPeopleCountSelector);
        andIClickContinue();
        thenIShouldSeeFormErrors(...requiredFieldErrorMessage);
        whenIClickOnTheErrorSummaryLinkContaining(...requiredFieldErrorMessage);
        thenMyFocusMovesTo(windfarmPeopleCountSelector);

        whenIType("not a number", windfarmPeopleCountSelector);
        andIClickContinue();
        thenIShouldSeeFormErrors(...mustBeANumberErrormessage);
        whenIClickOnTheErrorSummaryLinkContaining(...mustBeANumberErrormessage);
        thenMyFocusMovesTo(windfarmPeopleCountSelector);
      });
    });

    describe("the Other option", () => {
      it("requires an activity description if the Other checkbox is selected", () => {
        const expectedErrorMessage = ["Enter a description", "activity"];

        givenIHaveSelected(otherActivitySelector);
        whenIType(" ", otherActivityTextSelector);
        andIClickContinue();
        thenIShouldSeeFormErrors(...expectedErrorMessage);
        whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
        thenMyFocusMovesTo(otherActivityTextSelector);
      });

      it("requires an activity location if the Other checkbox is selected", () => {
        const expectedErrorMessage = ["Enter where", "you use"];

        givenIHaveSelected(otherActivitySelector);
        whenIType(" ", otherActivityLocationSelector);
        andIClickContinue();
        thenIShouldSeeFormErrors(...expectedErrorMessage);
        whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
        thenMyFocusMovesTo(otherActivityLocationSelector);
      });

      it("requires a people count if the Other checkbox is selected", () => {
        const requiredFieldErrorMessage = [
          "Enter how many",
          "people",
          "you use",
        ];
        const mustBeANumberErrormessage = [
          "Enter a whole number",
          "people",
          "you use",
        ];

        givenIHaveSelected(otherActivitySelector);

        whenIType(" ", otherActivityPeopleCountSelector);
        andIClickContinue();
        thenIShouldSeeFormErrors(...requiredFieldErrorMessage);
        whenIClickOnTheErrorSummaryLinkContaining(...requiredFieldErrorMessage);
        thenMyFocusMovesTo(otherActivityPeopleCountSelector);

        whenIType("not a number", otherActivityPeopleCountSelector);
        andIClickContinue();
        thenIShouldSeeFormErrors(...mustBeANumberErrormessage);
        whenIClickOnTheErrorSummaryLinkContaining(...mustBeANumberErrormessage);
        thenMyFocusMovesTo(otherActivityPeopleCountSelector);
      });
    });
  });

  xit("focuses me on the first radio button if there is an error", () => {
    // TODO issue #148 (https://github.com/mcagov/beacons-webapp/issues/148)
    whenIClickContinue();
    thenIShouldSeeAnErrorMessageThatContains(requiredFieldErrorMessage);
    thenIShouldSeeAnErrorSummaryLinkThatContains(
      "Maritime pleasure use",
      requiredFieldErrorMessage
    );

    whenIClickOnTheErrorSummaryLinkContaining(requiredFieldErrorMessage);
    thenMyFocusMovesTo("#motor-vessel");
  });
});
