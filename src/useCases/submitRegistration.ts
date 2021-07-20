import { IAppContainer } from "../lib/appContainer";

export type SubmitRegistrationFn = (
  submissionId: string,
  accountHolderId: string
) => Promise<ISubmitRegistrationResult>;

export interface ISubmitRegistrationResult {
  beaconRegistered: boolean;
  confirmationEmailSent: boolean;
  referenceNumber: string;
}

export const submitRegistration =
  ({
    sendConfirmationEmail,
    getCachedRegistration,
    getAccessToken,
    beaconsApiGateway,
    accountHolderApiGateway,
  }: Partial<IAppContainer>): SubmitRegistrationFn =>
  async (submissionId: string, accountHolderId: string) => {
    const registration = await getCachedRegistration(submissionId);
    const accessToken = await getAccessToken();

    registration.setReferenceNumber(referenceNumber("A#", 7));
    registration.setAccountHolderId(accountHolderId);

    const beaconRegistered = await beaconsApiGateway.sendRegistration(
      registration.serialiseToAPI(),
      accessToken
    );

    const { email: accountHolderEmail } =
      await accountHolderApiGateway.getAccountHolderDetails(
        accountHolderId,
        accessToken
      );

    const confirmationEmailSent = beaconRegistered
      ? await sendConfirmationEmail(
          registration.getRegistration(),
          accountHolderEmail
        )
      : false;

    if (!beaconRegistered) registration.setReferenceNumber("");

    return {
      beaconRegistered,
      confirmationEmailSent,
      referenceNumber: registration.getRegistration().referenceNumber || "",
    };
  };

const referenceNumber = (chars: string, length: number): string => {
  let mask = "";
  if (chars.indexOf("a") > -1) mask += "abcdefghijklmnopqrstuvwxyz";
  if (chars.indexOf("A") > -1) mask += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (chars.indexOf("#") > -1) mask += "0123456789";
  if (chars.indexOf("!") > -1) mask += "~`!@#$%^&*()_+-={}[]:\";'<>?,./|\\";
  let result = "";
  for (let i = length; i > 0; --i)
    result += mask[Math.floor(Math.random() * mask.length)];
  return result;
};
