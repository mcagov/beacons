import { DraftRegistration } from "../entities/DraftRegistration";
import { IAppContainer } from "../lib/IAppContainer";

export type UpdateRegistrationFn = (
  draftRegistration: DraftRegistration,
  registrationId: string
) => Promise<IUpdateRegistrationResult>;

export interface IUpdateRegistrationResult {
  beaconUpdated: boolean;
  referenceNumber: string;
}

export const updateRegistration =
  ({ beaconGateway }: IAppContainer): UpdateRegistrationFn =>
  async (
    draftRegistration: DraftRegistration,
    registrationId: string
  ): Promise<IUpdateRegistrationResult> => {
    const beaconUpdated = await beaconGateway.updateRegistration(
      draftRegistration,
      registrationId
    );

    return {
      beaconUpdated,
      referenceNumber: draftRegistration.referenceNumber,
    };
  };
