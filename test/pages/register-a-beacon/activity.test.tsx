import { render, screen } from "@testing-library/react";
import React from "react";
import { FormJSON } from "../../../src/lib/form/formManager";
import {
  Activity,
  Environment,
  Purpose,
} from "../../../src/lib/registration/types";
import ActivityPage from "../../../src/pages/register-a-beacon/activity";

describe("Activity", () => {
  const activityFormTestData: FormJSON = {
    hasErrors: false,
    errorSummary: [],
    fields: {
      activity: {
        value: Activity.ROWING,
        errorMessages: [],
      },
      otherActivityText: {
        value: "",
        errorMessages: [],
      },
    },
  };

  it("should render the page", () => {
    render(
      <ActivityPage
        form={activityFormTestData}
        flattenedRegistration={{
          environment: Environment.MARITIME,
          purpose: Purpose.PLEASURE,
        }}
      />
    );

    expect(screen.getByLabelText(/rowing/i)).toBeChecked();
  });
});
