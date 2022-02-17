import { render, screen } from "@testing-library/react";
import { EditPanelButton } from "./EditPanelButton";

describe("Edit Panel Button", () => {
  it("shows the button when the PATCH is present", async () => {
    render(
      <EditPanelButton
        onClick={() => {}}
        links={[
          { verb: "GET", path: "a-path/to-something" },
          { verb: "PATCH", path: "a-path/to-something" },
        ]}
      >
        edit something
      </EditPanelButton>
    );

    expect(await screen.findByText(/edit something/i)).toBeVisible();
  });

  it("doesn't show the button when the PATCH is not present", () => {
    render(
      <EditPanelButton
        onClick={() => {}}
        links={[
          { verb: "GET", path: "a-path/to-something" },
          { verb: "DELETE", path: "a-path/to-something" },
        ]}
      >
        edit something
      </EditPanelButton>
    );

    expect(screen.queryByText(/edit something/i)).toBeNull();
  });

  it("show the button when the links array is null", async () => {
    render(
      <EditPanelButton onClick={() => {}}>edit something</EditPanelButton>
    );

    expect(await screen.findByText(/edit something/i)).toBeVisible();
  });
});
