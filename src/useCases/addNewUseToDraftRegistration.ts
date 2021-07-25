import { IAppContainer } from "../lib/appContainer";

export type AddNewUseToDraftRegistrationFn = (
  submissionId: string
) => Promise<void>;

export const addNewUseToDraftRegistration =
  ({ draftRegistrationGateway }: IAppContainer) =>
  async (submissionId: string): Promise<void> => {
    await draftRegistrationGateway.createEmptyUse(submissionId);
  };
