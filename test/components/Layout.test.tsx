import { render } from "@testing-library/react";
import React, { ReactNode } from "react";
import { BeaconRegistrationHead } from "../../src/components/Layout";

jest.mock("next/head", () => {
  return {
    __esModule: true,
    default: ({ children }: { children: ReactNode }) => {
      return children;
    },
  };
});

describe("Layout", () => {
  describe("BeaconRegistrationHead", () => {
    const title = "Test page";

    it("should have the correct title when there is no error on the page", () => {
      render(<BeaconRegistrationHead title={title} pageHasErrors={false} />, {
        container: document.head,
      });
      expect(document.title).toBe(
        `${title} - Beacon Registration Service - GOV.UK`
      );
    });

    it("should have the correct title when there is an error on the page", () => {
      render(<BeaconRegistrationHead title={title} pageHasErrors={true} />, {
        container: document.head,
      });
      expect(document.title).toBe(
        `Error: ${title} - Beacon Registration Service - GOV.UK`
      );
    });
  });
});
