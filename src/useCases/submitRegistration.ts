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
  getRetrieveCachedRegistration,
  getSendGovNotifyEmail,
  getBeaconsApiGateway,
  getAuthGateway,
}: IAppContainer): SubmitRegistrationFn => async (submissionId) => {
  const authGateway = getAuthGateway();
  const beaconsApiGateway = getBeaconsApiGateway();
  const registration = await getRetrieveCachedRegistration()(submissionId);
  const sendGovNotifyEmail = getSendGovNotifyEmail().execute;

  const accessToken = await authGateway.getAccessToken();

  const beaconRegistered = await beaconsApiGateway.sendRegistration(
    registration.serialiseToAPI(),
    accessToken
  );

  const confirmationEmailSent = beaconRegistered
    ? await sendGovNotifyEmail(registration.getRegistration())
    : false;

  const registrationNumber = beaconRegistered ? referenceNumber("A#", 7) : "";

  return {
    beaconRegistered,
    confirmationEmailSent,
    registrationNumber,
  };
};
