import * as _ from "lodash";
import { DraftRegistration } from "../entities/DraftRegistration";
import { appContainer } from "../lib/appContainer";
import { IAppContainer } from "../lib/IAppContainer";

export const saveDraftRegistration =
  ({ draftRegistrationGateway }: IAppContainer = appContainer) =>
  async (id: string, updates: DraftRegistration): Promise<void> => {
    const existingDraftRegistration = await draftRegistrationGateway.read(id);

    if (
      existingDraftRegistration?.ownerAuthId &&
      updates.ownerAuthId &&
      existingDraftRegistration.ownerAuthId !== updates.ownerAuthId
    )
      return;

    await draftRegistrationGateway.update(
      id,
      _.merge(existingDraftRegistration, updates),
    );
  };
