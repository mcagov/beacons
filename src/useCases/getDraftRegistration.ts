import { DraftRegistration } from "../entities/DraftRegistration";
import { IAppContainer } from "../lib/IAppContainer";

export const getDraftRegistration =
  ({ draftRegistrationGateway }: IAppContainer) =>
  async (id: string): Promise<DraftRegistration> =>
    await draftRegistrationGateway.read(id);
