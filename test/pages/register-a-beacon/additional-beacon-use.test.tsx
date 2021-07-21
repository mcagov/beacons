import { render, screen, within } from "@testing-library/react";
import React from "react";
import {
  Activity,
  Environment,
  Purpose,
} from "../../../src/lib/registration/types";
import { formSubmissionCookieId } from "../../../src/lib/types";
import { ActionURLs, PageURLs, queryParams } from "../../../src/lib/urls";
import AdditionalBeaconUse, {
  getServerSideProps,
} from "../../../src/pages/register-a-beacon/additional-beacon-use";
import { getMockUse } from "../../mocks";

describe("AdditionalBeaconUse page", () => {
  it("given there are no uses, displays a 'no assigned uses' message", () => {
    render(<AdditionalBeaconUse uses={[]} currentUseIndex={0} />);

    expect(
      screen.getByText(/have not assigned any uses to this beacon yet/i)
    ).toBeVisible();
  });

  it("given there are no uses, doesn't allow the user to continue to the next stage", () => {
    render(<AdditionalBeaconUse uses={[]} currentUseIndex={0} />);

    expect(screen.queryByRole("button", { name: /continue/i })).toBeNull();
  });

  it("given there are no uses, instead prompts the user to add a use via a button", () => {
    render(<AdditionalBeaconUse uses={[]} currentUseIndex={0} />);

    expect(screen.getByRole("button", { name: /add a use/i })).toHaveAttribute(
      "href",
      ActionURLs.addNewUseToDraftRegistration
    );
  });

  it("given there are no uses, doesn't allow the user to go 'back' to the use-editing path", () => {
    render(<AdditionalBeaconUse uses={[]} currentUseIndex={0} />);

    expect(screen.queryByRole("link", { name: /^back$/i })).toBeNull();
  });

  it("given there is one use, displays that use", () => {
    const use = getMockUse();

    render(<AdditionalBeaconUse uses={[use]} currentUseIndex={0} />);

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

    render(<AdditionalBeaconUse uses={[use1, use2]} currentUseIndex={0} />);

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
        currentUseIndex={0}
      />
    );

    expect(screen.getByRole("button", { name: /add a use/i })).toHaveAttribute(
      "href",
      ActionURLs.addNewUseToDraftRegistration
    );
  });

  it("given a currentUseIndex, sends the user back down the editing route for that use", () => {
    const currentUseIndex = 1;
    render(
      <AdditionalBeaconUse
        uses={[getMockUse(), getMockUse()]}
        currentUseIndex={currentUseIndex}
      />
    );

    expect(screen.getByRole("link", { name: "Back" })).toHaveAttribute(
      "href",
      PageURLs.moreDetails + queryParams({ useIndex: currentUseIndex })
    );
  });

  describe("getServerSideProps()", () => {
    it("given a non-existent currentUseIndex, throws an error", () => {
      const mockRegistration = {
        getRegistration: jest
          .fn()
          .mockReturnValue({ model: "ASOS", uses: [getMockUse()] }),
      };
      const nonExistentUseIndex = "1";
      const context = {
        query: {
          useIndex: nonExistentUseIndex,
        },
        container: {
          getCachedRegistration: jest.fn().mockResolvedValue(mockRegistration),
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
