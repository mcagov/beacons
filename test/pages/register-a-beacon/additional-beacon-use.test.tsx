import { render, screen, within } from "@testing-library/react";
import React from "react";
import {
  Activity,
  Environment,
  Purpose,
} from "../../../src/lib/registration/types";
import AdditionalBeaconUse from "../../../src/pages/register-a-beacon/additional-beacon-use";
import { getMockUse } from "../../mocks";

describe("AdditionalBeaconUse page", () => {
  it("given there are no uses, displays a 'no assigned uses' message", () => {
    render(<AdditionalBeaconUse uses={[]} currentUseIndex={0} />);

    expect(screen.getByText(/have not assigned any uses to this beacon yet/i));
  });

  it("given there are no uses, doesn't allow the user to continue to the next stage", () => {
    render(<AdditionalBeaconUse uses={[]} currentUseIndex={0} />);

    expect(screen.queryByRole("button", { name: /continue/i })).toBeNull();
  });

  it("given there are no uses, instead prompts the user to add a use via a button", () => {
    render(<AdditionalBeaconUse uses={[]} currentUseIndex={0} />);

    expect(screen.getByRole("button", { name: /add a use/i }));
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
});
