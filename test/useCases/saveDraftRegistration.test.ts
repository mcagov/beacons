import { saveDraftRegistration } from "../../src/useCases/saveDraftRegistration";

describe("saveDraftRegistration", () => {
  it("only mutates the cache with the updated fields", async () => {
    const existingDraftRegistration = {
      ownerFullName: "Steve Stevington",
      ownerEmail: "steve@stevington.com",
      ownerTelephoneNumber: "07283 726182",
    };
    const updatesTodraftRegistration = {
      manufacturer: "ACME Inc.",
      model: "Excelsior",
      hexId: "1D0...",
    };
    const container = {
      draftRegistrationGateway: {
        deleteUse: jest.fn(),
        read: jest.fn().mockResolvedValue(existingDraftRegistration),
        update: jest.fn(),
      },
    };

    await saveDraftRegistration(container)(
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
      }
    );
  });
});
