import { IAppContainer } from "../lib/appContainer";
import { referenceNumber } from "../lib/utils";

export type SubmitRegistrationFn = (
  submissionId: string
) => Promise<ISubmitRegistrationResult>;

export interface ISubmitRegistrationResult {
  beaconRegistered: boolean;
  confirmationEmailSent: boolean;
  referenceNumber: string;
}

export const submitRegistration = ({
  sendConfirmationEmail,
  getCachedRegistration,
  getAccessToken,
  beaconsApiGateway,
}: Partial<IAppContainer>): SubmitRegistrationFn => async (submissionId) => {
  const registration = await getCachedRegistration(submissionId);
  const accessToken = await getAccessToken();

  registration.setReferenceNumber(referenceNumber("A#", 7));

  const beaconRegistered = await beaconsApiGateway.sendRegistration(
    registration.serialiseToAPI(),
    accessToken
  );

  const confirmationEmailSent = beaconRegistered
    ? await sendConfirmationEmail(registration.getRegistration())
    : false;

  if (!beaconRegistered) registration.setReferenceNumber("");

  return {
    beaconRegistered,
    confirmationEmailSent,
    referenceNumber: registration.getRegistration().referenceNumber || "",
  };
};
