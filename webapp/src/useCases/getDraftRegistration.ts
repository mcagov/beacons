import { DraftRegistration } from "../entities/DraftRegistration";
import { IAppContainer } from "../lib/IAppContainer";

export const getDraftRegistration =
  ({ draftRegistrationGateway }: IAppContainer) =>
  async (id: string, authId: string): Promise<DraftRegistration> => {
    const draftRegistration = await draftRegistrationGateway.read(id);

    if (draftRegistration?.ownerAuthId !== authId) return null;

    return draftRegistration;
  };
