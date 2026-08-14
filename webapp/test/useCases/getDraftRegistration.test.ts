import { DraftRegistration } from "../../src/entities/DraftRegistration";
import { IAppContainer } from "../../src/lib/IAppContainer";
import { getDraftRegistration } from "../../src/useCases/getDraftRegistration";

describe("getDraftRegistration", () => {
  const draftOwnedBy = (ownerAuthId: string): DraftRegistration => ({
    ownerAuthId,
    ownerFullName: "does-not-matter",
    uses: [],
  });

  const containerReturning = (
    draftRegistration: DraftRegistration,
  ): Partial<IAppContainer> => ({
    draftRegistrationGateway: {
      read: jest.fn().mockResolvedValue(draftRegistration),
    } as any,
  });

  it("returns the draft when it belongs to the requesting user", async () => {
    const draftRegistration = draftOwnedBy("owner-auth-id");
    const container = containerReturning(draftRegistration);

    const result = await getDraftRegistration(container as any)(
      "draft-id",
      "auth-id-a",
    );

    expect(result).toStrictEqual(draftRegistration);
  });

  it("returns null when the draft belongs to a different user", async () => {
    const container = containerReturning(draftOwnedBy("auth-id-a"));

    const result = await getDraftRegistration(container as any)(
      "draft-id",
      "auth-id-b",
    );

    expect(result).toBeNull();
  });

  it("returns null when no draft exists", async () => {
    const container = containerReturning(null);

    const result = await getDraftRegistration(container as any)(
      "draft-id",
      "requester-auth-id",
    );

    expect(result).toBeNull();
  });
});
