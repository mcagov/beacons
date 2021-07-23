import { DraftRegistration } from "../entities/DraftRegistration";
import { appContainer, IAppContainer } from "../lib/appContainer";

export const saveDraftRegistration =
  ({ draftRegistrationGateway }: IAppContainer = appContainer) =>
  async (id: string, updates: DraftRegistration): Promise<void> => {
    const existingDraftRegistration = await draftRegistrationGateway.read(id);

    await draftRegistrationGateway.update(id, {
      ...existingDraftRegistration,
      ...updates,
    });
  };
