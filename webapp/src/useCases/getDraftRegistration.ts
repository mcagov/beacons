import { DraftRegistration } from "../entities/DraftRegistration";
import { IAppContainer } from "../lib/IAppContainer";

export const getDraftRegistration =
  ({ draftRegistrationGateway }: IAppContainer) =>
  async (id: string): Promise<DraftRegistration> => {
    const draftRegistration = await draftRegistrationGateway.read(id);
    return {
      ...draftRegistration,
      id: id,
    };
  };
