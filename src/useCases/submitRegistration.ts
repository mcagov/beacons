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
  getSendConfirmationEmail,
  getBeaconsApiGateway,
  getRetrieveAccessToken,
}: IAppContainer): SubmitRegistrationFn => async (submissionId) => {
  const retrieveAccessToken = getRetrieveAccessToken();
  const beaconsApiGateway = getBeaconsApiGateway();
  const registration = await getRetrieveCachedRegistration()(submissionId);
  const sendGovNotifyEmail = getSendConfirmationEmail();

  const accessToken = await retrieveAccessToken();

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
