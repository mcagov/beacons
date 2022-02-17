import { DraftRegistration } from "../../src/entities/DraftRegistration";
import { Environment } from "../../src/lib/deprecatedRegistration/types";
import { saveDraftRegistration } from "../../src/useCases/saveDraftRegistration";

describe("saveDraftRegistration", () => {
  it("only mutates the cache with the updated fields", async () => {
    const existingDraftRegistration: DraftRegistration = {
      ownerFullName: "Steve Stevington",
      ownerEmail: "steve@stevington.com",
      ownerTelephoneNumber: "07283 726182",
      uses: [],
    };
    const updatesTodraftRegistration: DraftRegistration = {
      manufacturer: "ACME Inc.",
      model: "Excelsior",
      hexId: "1D0...",
      uses: [],
    };
    const container = {
      draftRegistrationGateway: {
        deleteUse: jest.fn(),
        read: jest.fn().mockResolvedValue(existingDraftRegistration),
        update: jest.fn(),
      },
    };

    await saveDraftRegistration(container as any)(
      "test-id",
      updatesTodraftRegistration
    );

    expect(container.draftRegistrationGateway.update).toHaveBeenCalledWith(
      "test-id",
      {
        ownerFullName: "Steve Stevington",
        ownerEmail: "steve@stevington.com",
        ownerTelephoneNumber: "07283 726182",
        manufacturer: "ACME Inc.",
        model: "Excelsior",
        hexId: "1D0...",
        uses: [],
      }
    );
  });

  it("retains existing properties of the mutated uses array element", async () => {
    const existingDraftRegistration: DraftRegistration = {
      uses: [
        {
          environment: Environment.MARITIME,
        },
      ],
    };
    const updatesTodraftRegistration: DraftRegistration = {
      uses: [{ vesselName: "SS Fedora" }],
    };
    const container = {
      draftRegistrationGateway: {
        deleteUse: jest.fn(),
        read: jest.fn().mockResolvedValue(existingDraftRegistration),
        update: jest.fn(),
      },
    };

    await saveDraftRegistration(container as any)(
      "test-id",
      updatesTodraftRegistration
    );

    expect(container.draftRegistrationGateway.update).toHaveBeenCalledWith(
      "test-id",
      {
        uses: [{ environment: Environment.MARITIME, vesselName: "SS Fedora" }],
      }
    );
  });
});
