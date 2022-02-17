/**
 * @jest-environment jsdom
 */

import { render, screen, within } from "@testing-library/react";
import React from "react";
import {
  Activity,
  Environment,
  Purpose,
} from "../../../src/lib/deprecatedRegistration/types";
import { formSubmissionCookieId } from "../../../src/lib/types";
import {
  ActionURLs,
  CreateRegistrationPageURLs,
  queryParams,
} from "../../../src/lib/urls";
import AdditionalBeaconUse, {
  getServerSideProps,
} from "../../../src/pages/register-a-beacon/additional-beacon-use";
import { getMockUse } from "../../mocks";

describe("AdditionalBeaconUse page", () => {
  it("given there are no uses, displays a 'no assigned uses' message", () => {
    render(<AdditionalBeaconUse uses={[]} currentUseId={0} />);

    expect(
      screen.getByText(/have not assigned any uses to this beacon yet/i)
    ).toBeVisible();
  });

  it("given there are no uses, doesn't allow the user to continue to the next stage", () => {
    render(<AdditionalBeaconUse uses={[]} currentUseId={0} />);

    expect(screen.queryByRole("button", { name: /continue/i })).toBeNull();
  });

  it("given there are no uses, instead prompts the user to add a use via a button", () => {
    render(<AdditionalBeaconUse uses={[]} currentUseId={0} />);

    expect(screen.getByRole("button", { name: /add a use/i })).toHaveAttribute(
      "href",
      ActionURLs.addNewUseToDraftRegistration
    );
  });

  it("given there are no uses, doesn't allow the user to go 'back' to the use-editing path", () => {
    render(<AdditionalBeaconUse uses={[]} currentUseId={0} />);

    expect(screen.queryByRole("link", { name: /^back$/i })).toBeNull();
  });

  it("given there is one use, displays that use", () => {
    const use = getMockUse();

    render(<AdditionalBeaconUse uses={[use]} currentUseId={0} />);

    const content = screen.getByRole("main");
    expect(within(content).getByText(new RegExp(use.environment, "i")));
    expect(within(content).getByText(new RegExp(use.activity, "i")));
    expect(within(content).getByText(new RegExp(use.purpose, "i")));
  });

  it("given there are many uses, displays all uses", () => {
    const use1 = getMockUse();
    const use2 = {
      ...getMockUse(),
      environment: Environment.AVIATION,
      purpose: Purpose.COMMERCIAL,
      activity: Activity.GLIDER,
    };

    render(<AdditionalBeaconUse uses={[use1, use2]} currentUseId={0} />);

    const content = screen.getByRole("main");
    expect(within(content).getByText(new RegExp(use1.environment, "i")));
    expect(within(content).getByText(new RegExp(use1.activity, "i")));
    expect(within(content).getByText(new RegExp(use1.purpose, "i")));
    expect(within(content).getByText(new RegExp(use2.environment, "i")));
    expect(within(content).getByText(new RegExp(use2.activity, "i")));
    expect(within(content).getByText(new RegExp(use2.purpose, "i")));
  });

  it("given there are uses, allows the user to add another use via a button", () => {
    render(
      <AdditionalBeaconUse
        uses={[getMockUse(), getMockUse()]}
        currentUseId={0}
      />
    );

    expect(
      screen.getByRole("button", { name: /add another use/i })
    ).toHaveAttribute("href", ActionURLs.addNewUseToDraftRegistration);
  });

  it("given a currentUseId, sends the user back down the editing route for that use", () => {
    const currentUseId = 1;
    render(
      <AdditionalBeaconUse
        uses={[getMockUse(), getMockUse()]}
        currentUseId={currentUseId}
      />
    );

    expect(screen.getByRole("link", { name: "Back" })).toHaveAttribute(
      "href",
      CreateRegistrationPageURLs.moreDetails +
        queryParams({ useId: currentUseId })
    );
  });

  describe("getServerSideProps()", () => {
    it("given a non-existent currentUseId, throws an error", () => {
      const mockSessionGateway = {
        getSession: jest
          .fn()
          .mockReturnValue({ user: { authId: "a-session-id" } }),
      };
      const mockRegistration = {
        getRegistration: jest
          .fn()
          .mockReturnValue({ model: "ASOS", uses: [getMockUse()] }),
      };
      const nonExistentUseId = "1";
      const context = {
        query: {
          useId: nonExistentUseId,
        },
        container: {
          getCachedRegistration: jest.fn().mockResolvedValue(mockRegistration),
          sessionGateway: mockSessionGateway,
        },
        req: {
          cookies: {
            [formSubmissionCookieId]: "test-submission-id",
          },
        },
      };

      expect(() => getServerSideProps(context as any)).rejects.toThrow();
    });
  });
});
