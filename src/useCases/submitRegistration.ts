import { DraftRegistration } from "../entities/DraftRegistration";
import { Registration } from "../entities/Registration";
import { IAppContainer } from "../lib/IAppContainer";

export type SubmitRegistrationFn = (
  draftRegistration: DraftRegistration,
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
    getAccessToken,
    beaconsApiGateway,
    accountHolderApiGateway,
  }: Partial<IAppContainer>): SubmitRegistrationFn =>
  async (draftRegistration: DraftRegistration, accountHolderId: string) => {
    const accessToken = await getAccessToken();

    const draftRegistrationWithReferenceAndAccountHolderId: DraftRegistration =
      {
        ...draftRegistration,
        referenceNumber: referenceNumber("A#", 7),
        accountHolderId,
      };

    const beaconRegistered = await beaconsApiGateway.sendRegistration(
      draftRegistrationWithReferenceAndAccountHolderId,
      accessToken
    );

    const { email: accountHolderEmail } =
      await accountHolderApiGateway.getAccountHolderDetails(
        accountHolderId,
        accessToken
      );

    const confirmationEmailSent = beaconRegistered
      ? await sendConfirmationEmail(
          draftRegistrationWithReferenceAndAccountHolderId as Registration,
          accountHolderEmail
        )
      : false;

    if (!beaconRegistered)
      draftRegistrationWithReferenceAndAccountHolderId.referenceNumber = "";

    return {
      beaconRegistered,
      confirmationEmailSent,
      referenceNumber:
        draftRegistrationWithReferenceAndAccountHolderId.referenceNumber || "",
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
