import { addNewUseToDraftRegistration } from "../../src/useCases/addNewUseToDraftRegistration";
import { IAppContainer } from "../../src/lib/IAppContainer";

describe("addNewUseToDraftRegistration", () => {
  const submissionId = "test-submission-id";

  it("creates a use and stamps the signed-in user as the owner of a new draft", async () => {
    const draftRegistrationGateway = {
      read: jest
        .fn()
        .mockResolvedValueOnce(null) // no draft yet
        .mockResolvedValueOnce({ uses: [{}] }), // after createEmptyUse
      createEmptyUse: jest.fn(),
      update: jest.fn(),
    };
    const addNewUse = addNewUseToDraftRegistration({
      draftRegistrationGateway,
      authId: "auth-id",
    } as unknown as IAppContainer);

    await addNewUse(submissionId);

    expect(draftRegistrationGateway.createEmptyUse).toHaveBeenCalledWith(
      submissionId,
    );
    expect(draftRegistrationGateway.update).toHaveBeenCalledWith(submissionId, {
      uses: [{}],
      ownerAuthId: "auth-id",
    });
  });

  it("does not re-stamp ownership when the draft already has an owner", async () => {
    const draftRegistrationGateway = {
      read: jest.fn().mockResolvedValue({ uses: [{}], ownerAuthId: "auth-id" }),
      createEmptyUse: jest.fn(),
      update: jest.fn(),
    };
    const addNewUse = addNewUseToDraftRegistration({
      draftRegistrationGateway,
      authId: "auth-id",
    } as unknown as IAppContainer);

    await addNewUse(submissionId);

    expect(draftRegistrationGateway.createEmptyUse).toHaveBeenCalledWith(
      submissionId,
    );
    expect(draftRegistrationGateway.update).not.toHaveBeenCalled();
  });

  it("does not modify a draft owned by a different user", async () => {
    const draftRegistrationGateway = {
      read: jest
        .fn()
        .mockResolvedValue({ uses: [{}], ownerAuthId: "someone-else" }),
      createEmptyUse: jest.fn(),
      update: jest.fn(),
    };
    const addNewUse = addNewUseToDraftRegistration({
      draftRegistrationGateway,
      authId: "auth-id",
    } as unknown as IAppContainer);

    await addNewUse(submissionId);

    expect(draftRegistrationGateway.createEmptyUse).not.toHaveBeenCalled();
    expect(draftRegistrationGateway.update).not.toHaveBeenCalled();
  });
});
