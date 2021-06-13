import { IAppContainer } from "../lib/appContainer";
import { referenceNumber } from "../lib/utils";

export type SubmitRegistrationFn = (
  submissionId: string
) => Promise<ISubmitRegistrationResult>;

export interface ISubmitRegistrationResult {
  beaconRegistered: boolean;
  confirmationEmailSent: boolean;
  registrationNumber: string;
}

export const submitRegistration = ({
  sendConfirmationEmail,
  getCachedRegistration,
  getAccessToken,
  getBeaconsApiGateway,
}: Partial<IAppContainer>): SubmitRegistrationFn => async (submissionId) => {
  const { sendRegistration } = getBeaconsApiGateway();
  const registration = await getCachedRegistration(submissionId);
  const accessToken = await getAccessToken();

  const beaconRegistered = await sendRegistration(
    registration.serialiseToAPI(),
    accessToken
  );

  const confirmationEmailSent = beaconRegistered
    ? await sendConfirmationEmail(registration.getRegistration())
    : false;

  const registrationNumber = beaconRegistered ? referenceNumber("A#", 7) : "";

  return {
    beaconRegistered,
    confirmationEmailSent,
    registrationNumber,
  };
};
