import { IAppContainer } from "../lib/IAppContainer";

export type AddNewUseToDraftRegistrationFn = (
  submissionId: string,
) => Promise<void>;

export const addNewUseToDraftRegistration =
  ({ draftRegistrationGateway, authId }: IAppContainer) =>
  async (submissionId: string): Promise<void> => {
    const existingDraftRegistration =
      await draftRegistrationGateway.read(submissionId);

    // Fail closed: never let one user add a use to another user's draft.
    if (
      existingDraftRegistration?.ownerAuthId &&
      existingDraftRegistration.ownerAuthId !== authId
    )
      return;

    await draftRegistrationGateway.createEmptyUse(submissionId);

    // Stamp ownership when a draft is first created via this path (mirrors
    // saveDraftRegistration). Without it the draft has no owner and
    // getDraftRegistration would treat it as not-owned on the next request.
    if (authId && !existingDraftRegistration?.ownerAuthId) {
      const draftRegistration =
        await draftRegistrationGateway.read(submissionId);
      await draftRegistrationGateway.update(submissionId, {
        ...draftRegistration,
        ownerAuthId: authId,
      });
    }
  };
