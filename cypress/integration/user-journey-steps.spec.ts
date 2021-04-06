import { PageURLs } from "../../src/lib/urls";
import {
  andIClickContinue,
  andIHaveSelected,
  givenIHaveBeenTo,
  givenIHaveClicked,
  givenIHaveClickedContinue,
  givenIHaveTyped,
} from "./selectors-and-assertions.spec";

export const givenIHaveEnteredMyBeaconDetails = (): void => {
  givenIHaveBeenTo(PageURLs.start);
  givenIHaveClicked(".govuk-button--start");
  givenIHaveTyped("m", "#manufacturer");
  givenIHaveTyped("m", "#model");
  givenIHaveTyped("1D0E9B07CEFFBFF", "#hexId");
  givenIHaveClickedContinue();
  givenIHaveTyped("42", "#manufacturerSerialNumber");
  givenIHaveClickedContinue();
};

export const givenIAmAMaritimePleasureUser = (): void => {
  givenIHaveEnteredMyBeaconDetails();

  andIHaveSelected("#maritime");
  andIClickContinue();
  andIHaveSelected("#pleasure");
  andIClickContinue();
};
export const givenIAmAnAviationBeaconOwner = (): void => {
  givenIHaveEnteredMyBeaconDetails();

  andIHaveSelected("#aviation");
  andIClickContinue();
};
