import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { cloneDeep } from "lodash";
import { IBeacon } from "../../entities/IBeacon";
import { beaconFixture } from "../../fixtures/beacons.fixture";
import { BeaconSummaryEditing } from "./BeaconSummaryEditing";

describe("BeaconSummaryEditing", () => {
  it("user can type text in basic string input fields", async () => {
    const onSave = jest.fn();

    render(
      <BeaconSummaryEditing
        beacon={beaconFixture}
        onSave={onSave}
        onCancel={jest.fn()}
      />,
    );
    const editableField = await screen.findByDisplayValue(
      beaconFixture.chkCode as string,
    );

    const chkCode = "X675F";
    await act(async () => {
      await userEvent.clear(editableField);
      await userEvent.type(editableField, chkCode);
    });

    expect(await screen.findByDisplayValue(chkCode)).toBeVisible();
    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: "Save" }));
    });
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ chkCode }));
    });
  });

  it("user can use dropdown to update mti", async () => {
    const onSave = jest.fn();

    render(
      <BeaconSummaryEditing
        beacon={beaconFixture}
        onSave={onSave}
        onCancel={jest.fn()}
      />,
    );

    const dropdownField = await screen.findByLabelText(/mti/i);
    await act(async () => {
      await userEvent.selectOptions(dropdownField, "TEST_EPIRB");
      await userEvent.click(screen.getByRole("button", { name: "Save" }));
    });
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({ mti: "TEST_EPIRB" }),
      );
    });
  });

  it("user can use dropdown to update protocol", async () => {
    const onSave = jest.fn();

    render(
      <BeaconSummaryEditing
        beacon={beaconFixture}
        onSave={onSave}
        onCancel={jest.fn()}
      />,
    );

    const dropdownField = await screen.findByLabelText(/protocol/i);
    const protocol = "EPIRB, non-GPS, non-CSTA, UK Serialised";

    await act(async () => {
      await userEvent.selectOptions(dropdownField, protocol);
      await userEvent.click(screen.getByRole("button", { name: "Save" }));
    });
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({ protocol }),
      );
    });
  });

  it("calls the cancel callback to abort the edit", async () => {
    const onCancel = jest.fn();
    act(() => {
      render(
        <BeaconSummaryEditing
          beacon={beaconFixture}
          onSave={jest.fn()}
          onCancel={onCancel}
        />,
      );
    });
    const editableField = await screen.findByDisplayValue(
      beaconFixture.chkCode as string,
    );
    await act(async () => {
      await userEvent.clear(editableField);
      await userEvent.type(editableField, "ZXFG7");
    });
    const cancelButton = screen.getByRole("button", { name: "Cancel" });

    await act(async () => {
      await userEvent.click(cancelButton);
    });
    await waitFor(() => {
      expect(onCancel).toHaveBeenCalled();
    });
  });

  describe("Manufacturer and model", () => {
    it("user can select manufacturer and model from dropdown and update beacon", async () => {
      const onSave = jest.fn();

      render(
        <BeaconSummaryEditing
          beacon={beaconFixture}
          onSave={onSave}
          onCancel={jest.fn()}
        />,
      );

      const manufacturerField = await screen.findByLabelText(/manufacturer/i);
      const modelField = await screen.findByLabelText(/model/i);
      const manufacturer = "Ocean Signal";
      const model =
        "CSTA 1362, EPIRB3 (non-Float Free), EPIRB3 Pro (Float Free / non-Float Free)";

      await act(async () => {
        await userEvent.selectOptions(manufacturerField, manufacturer);
        await userEvent.selectOptions(modelField, model);

        await userEvent.click(screen.getByRole("button", { name: "Save" }));
      });
      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(
          expect.objectContaining({
            manufacturer,
            model,
          }),
        );
      });
    });

    it("selecting a different manufacturer resets the model to N/A", async () => {
      const onSave = jest.fn();

      render(
        <BeaconSummaryEditing
          beacon={beaconFixture}
          onSave={onSave}
          onCancel={jest.fn()}
        />,
      );

      const manufacturerField = await screen.findByLabelText(/manufacturer/i);
      const manufacturer = "Ocean Signal";

      await act(async () => {
        await userEvent.selectOptions(manufacturerField, manufacturer);
      });

      expect(await screen.findByLabelText(/model/i)).toHaveDisplayValue("N/A");

      await act(async () => {
        await userEvent.click(screen.getByRole("button", { name: "Save" }));
      });

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(
          expect.objectContaining({
            manufacturer,
            model: "",
          }),
        );
      });
    });

    describe("beacon has manufacturer and model that are not in model & manufacturer json", () => {
      it("should display the initial manufacturer and model in the select options", async () => {
        const onSave = jest.fn();
        const manufacturerValue = "Not a manufacturer";
        const modelValue = "Not a model";

        const beaconFixtureWithFreeManufacturerAndModel: IBeacon = {
          ...cloneDeep(beaconFixture),
          manufacturer: manufacturerValue,
          model: modelValue,
        };

        render(
          <BeaconSummaryEditing
            beacon={beaconFixtureWithFreeManufacturerAndModel}
            onSave={onSave}
            onCancel={jest.fn()}
          />,
        );

        expect(
          await screen.findByLabelText(/manufacturer/i),
        ).toHaveDisplayValue(manufacturerValue);
        expect(await screen.findByLabelText(/model/i)).toHaveDisplayValue(
          modelValue,
        );
      });
    });
  });
});
