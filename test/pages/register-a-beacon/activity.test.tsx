import { render, screen } from "@testing-library/react";
import React from "react";
import {
  Activity,
  Environment,
  Purpose,
} from "../../../src/lib/deprecatedRegistration/types";
import { FormJSON } from "../../../src/lib/form/FormManager";
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
      otherActivityLocation: {
        value: "",
        errorMessages: [],
      },
      otherActivityPeopleCount: { value: "", errorMessages: [] },
      workingRemotelyLocation: { value: "", errorMessages: [] },
      workingRemotelyPeopleCount: { value: "", errorMessages: [] },
      windfarmLocation: { value: "", errorMessages: [] },
      windfarmPeopleCount: { value: "", errorMessages: [] },
    },
  };

  describe("the page heading", () => {
    function assertPageHeadingContains(
      expected: string,
      environment: Environment,
      purpose: Purpose
    ): void {
      render(
        <ActivityPage
          form={activityFormTestData}
          showCookieBanner={false}
          useId={0}
          environment={environment}
          purpose={purpose}
        />
      );

      expect(screen.getByText(expected, { exact: false })).toBeDefined();
    }

    it("should not show the purpose if the environment is land", () => {
      assertPageHeadingContains(
        "select the land activity",
        Environment.LAND,
        Purpose.PLEASURE
      );
    });

    it("should show the correct title for a maritime, pleasure use", () => {
      assertPageHeadingContains(
        "select the pleasure maritime activity",
        Environment.MARITIME,
        Purpose.PLEASURE
      );
    });

    it("should show the correct title for a maritime, commercial use", () => {
      assertPageHeadingContains(
        "select the commercial maritime activity",
        Environment.MARITIME,
        Purpose.COMMERCIAL
      );
    });

    it("should show the correct title for an aviation, pleasure use", () => {
      assertPageHeadingContains(
        "select the pleasure aviation activity",
        Environment.AVIATION,
        Purpose.PLEASURE
      );
    });

    it("should show the correct title for an aviation, commercial use", () => {
      assertPageHeadingContains(
        "select the commercial aviation activity",
        Environment.AVIATION,
        Purpose.COMMERCIAL
      );
    });
  });
});
