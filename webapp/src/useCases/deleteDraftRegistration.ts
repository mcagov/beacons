import { appContainer } from "../lib/appContainer";
import { IAppContainer } from "../lib/IAppContainer";

export const deleteDraftRegistration =
  ({ draftRegistrationGateway }: IAppContainer = appContainer) =>
  async (id: string): Promise<void> =>
    await draftRegistrationGateway.delete(id);
