import { IAppContainer } from "../lib/appContainer";
import { IRegistration } from "../lib/registration/types";
import { joinStrings } from "../lib/writingStyle";

export type SendConfirmationEmailFn = (
  registration: IRegistration
) => Promise<boolean>;

export const sendConfirmationEmail =
  ({ govNotifyGateway }: IAppContainer): SendConfirmationEmailFn =>
  async (registration) => {
    const templateId = process.env.GOV_NOTIFY_CUSTOMER_EMAIL_TEMPLATE;

    if (templateId) {
      return govNotifyGateway.sendEmail(templateId, registration.ownerEmail, {
        owner_name: registration.ownerFullName,
        reference: registration.referenceNumber,
        beacon_information: joinStrings([
          registration.manufacturer,
          registration.model,
          registration.hexId,
        ]),
        owner_details: joinStrings([
          registration.ownerFullName,
          registration.ownerTelephoneNumber,
          registration.ownerAlternativeTelephoneNumber,
          registration.ownerEmail,
        ]),
        owner_address: joinStrings([
          registration.ownerAddressLine1,
          registration.ownerAddressLine2,
          registration.ownerTownOrCity,
          registration.ownerPostcode,
        ]),
        emergency_contact_1_name: registration.emergencyContact1FullName,
        emergency_contact_1_telephone_number:
          registration.emergencyContact1TelephoneNumber,
        emergency_contact_1_alternative_telephone_number:
          registration.emergencyContact1AlternativeTelephoneNumber,
        emergency_contact_2_name: registration.emergencyContact2FullName,
        emergency_contact_2_telephone_number:
          registration.emergencyContact2TelephoneNumber,
        emergency_contact_2_alternative_telephone_number:
          registration.emergencyContact2AlternativeTelephoneNumber,
        emergency_contact_3_name: registration.emergencyContact3FullName,
        emergency_contact_3_telephone_number:
          registration.emergencyContact3TelephoneNumber,
        emergency_contact_3_alternative_telephone_number:
          registration.emergencyContact3AlternativeTelephoneNumber,
      });
    }

    return false;
  };
