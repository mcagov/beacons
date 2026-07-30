import { DraftRegistration } from "../../src/entities/DraftRegistration";
import { getDraftRegistration } from "../../src/useCases/getDraftRegistration";

describe("getDraftRegistration", () => {
  it("returns the draft when it belongs to the requesting user", async () => {
    const draftRegistration: DraftRegistration = {
      ownerAuthId: "auth-id-a",
      ownerFullName: "Steve Stevington",
      uses: [],
    };
    const container = {
      draftRegistrationGateway: {
        read: jest.fn().mockResolvedValue(draftRegistration),
      },
    };

    const result = await getDraftRegistration(container as any)(
      "draft-id",
      "auth-id-a",
    );

    expect(result).toStrictEqual(draftRegistration);
  });

  it("returns null when the draft belongs to a different user", async () => {
    const draftRegistration: DraftRegistration = {
      ownerAuthId: "auth-id-a",
      ownerFullName: "Steve Stevington",
      uses: [],
    };
    const container = {
      draftRegistrationGateway: {
        read: jest.fn().mockResolvedValue(draftRegistration),
      },
    };

    const result = await getDraftRegistration(container as any)(
      "draft-id",
      "auth-id-b",
    );

    expect(result).toBeNull();
  });

  it("returns the falsy value from the gateway when no draft exists", async () => {
    const container = {
      draftRegistrationGateway: {
        read: jest.fn().mockResolvedValue(null),
      },
    };

    const result = await getDraftRegistration(container as any)(
      "draft-id",
      "auth-id-a",
    );

    expect(result).toBeNull();
  });
});
