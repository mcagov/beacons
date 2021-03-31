import { FormJSON } from "../../src/lib/form/formManager";
import {
  givenIAmAt,
  iCanClickTheBackLinkToGoToPreviousPage,
} from "./common.spec";

describe("As a beacon owner, I want to register how I use my beacon in the land/other environment", () => {
  const thisPageUrl = "/register-a-beacon/land-other";
  const previousPageUrl = "/register-a-beacon/beacon-use";
  const nextPageUrl = "";

  beforeEach(() => {
    givenIAmAt(thisPageUrl);
  });

  it("sends me to the previous page when I click the back link", () => {
    iCanClickTheBackLinkToGoToPreviousPage(previousPageUrl);
  });

  xit("submits the form if all fields are valid", () => {});
});

const emptyLandOtherForm: FormJSON = {
  hasErrors: false,
  errorSummary: [],
  fields: {
    driving: {
      value: "",
      errorMessages: [],
    },
    cycling: {
      value: "",
      errorMessages: [],
    },
    climbingMountaineering: {
      value: "",
      errorMessages: [],
    },
    skiing: {
      value: "",
      errorMessages: [],
    },
    walkingHiking: {
      value: "",
      errorMessages: [],
    },
    workingRemotely: {
      value: "",
      errorMessages: [],
    },
    workingRemotelyLocation: {
      value: "",
      errorMessages: [],
    },
    workingRemotelyPeopleCount: {
      value: "",
      errorMessages: [],
    },
    windfarm: {
      value: "",
      errorMessages: [],
    },
    windfarmLocation: {
      value: "",
      errorMessages: [],
    },
    windfarmPeopleCount: {
      value: "",
      errorMessages: [],
    },
    otherUse: {
      value: "",
      errorMessages: [],
    },
    otherUseDescription: {
      value: "",
      errorMessages: [],
    },
    otherUseLocation: {
      value: "",
      errorMessages: [],
    },
    otherUsePeopleCount: {
      value: "",
      errorMessages: [],
    },
  },
};
