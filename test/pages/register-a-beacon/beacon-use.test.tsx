import { render } from "@testing-library/react";
import React from "react";
import { FormJSON } from "../../../src/lib/form/formManager";
import BeaconUse from "../../../src/pages/register-a-beacon/beacon-use";

describe("BeaconUse", () => {
  const beaconUseForm: FormJSON = {
    hasErrors: false,
    fields: {
      environment: {
        value: "",
        errorMessages: [],
      },
      environmentOtherInput: {
        value: "",
        errorMessages: [],
      },
    },
    errorSummary: [],
  };

  it("should render the beacon use page", () => {
    render(<BeaconUse form={beaconUseForm} />);
  });
});
