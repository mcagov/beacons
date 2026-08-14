import { DraftRegistration } from "../entities/DraftRegistration";
import { IAppContainer } from "../lib/IAppContainer";
import logger from "../logger";

export const getDraftRegistration =
  ({ draftRegistrationGateway }: IAppContainer) =>
  async (id: string, authId: string): Promise<DraftRegistration> => {
    const draftRegistration = await draftRegistrationGateway.read(id);

    if (!draftRegistration) {
      logger.info(`getDraftRegistration - no draft found for id: ${id}`);
      return null;
    }

    if (draftRegistration.ownerAuthId !== authId) {
      logger.info(`getDraftRegistration - draft not owned by requester: ${id}`);
      return null;
    }

    return draftRegistration;
  };
