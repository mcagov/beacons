import { DraftRegistration } from "../../src/entities/DraftRegistration";
import { IAppContainer } from "../../src/lib/IAppContainer";
import { getDraftRegistration } from "../../src/useCases/getDraftRegistration";

describe("getDraftRegistration", () => {
  const draftOwnedBy = (ownerAuthId: string): DraftRegistration => ({
    ownerAuthId,
    ownerFullName: "does-not-matter",
    uses: [],
  });

  const containerFor = (
    authId: string,
    draftRegistration: DraftRegistration,
  ): Partial<IAppContainer> => ({
    authId,
    draftRegistrationGateway: {
      read: jest.fn().mockResolvedValue(draftRegistration),
    } as any,
  });

  it("returns the draft when it belongs to the requesting user", async () => {
    const draftRegistration = draftOwnedBy("owner-auth-id");
    const container = containerFor("owner-auth-id", draftRegistration);

    const result = await getDraftRegistration(container as any)("draft-id");

    expect(result).toStrictEqual(draftRegistration);
  });

  it("returns null when the draft belongs to a different user", async () => {
    const container = containerFor(
      "requester-auth-id",
      draftOwnedBy("owner-auth-id"),
    );

    const result = await getDraftRegistration(container as any)("draft-id");

    expect(result).toBeNull();
  });

  it("returns null when no draft exists", async () => {
    const container = containerFor("requester-auth-id", null);

    const result = await getDraftRegistration(container as any)("draft-id");

    expect(result).toBeNull();
  });
});
