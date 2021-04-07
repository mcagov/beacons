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

export const asAMaritimeBeaconOwner = (): void => {
  givenIHaveEnteredMyBeaconDetails();

  andIHaveSelected("#maritime");
  andIClickContinue();
};

export const asAnAviationBeaconOwner = (): void => {
  givenIHaveEnteredMyBeaconDetails();

  andIHaveSelected("#aviation");
  andIClickContinue();
};

export const asAMaritimePleasureBeaconOwner = (): void => {
  asAMaritimeBeaconOwner();
  andIHaveSelected("#pleasure");
  andIClickContinue();
};
