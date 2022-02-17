import React, { FunctionComponent } from "react";
import { AccountHolder } from "../../entities/AccountHolder";
import { AccountListBeacon } from "../../entities/AccountListBeacon";

export interface LegacyBeaconsNotificationProps {
  beacons: AccountListBeacon[];
  accountHolderDetails: AccountHolder;
}

const LegacyBeaconsNotification: FunctionComponent<LegacyBeaconsNotificationProps> =
  ({
    beacons,
    accountHolderDetails,
  }: LegacyBeaconsNotificationProps): JSX.Element => {
    return (
      <div className="govuk-notification-banner">
        <div className="govuk-notification-banner__header">
          <h2 className="govuk-notification-banner__title">
            {beacons.length} {beacons.length > 1 ? "beacons" : "beacon"} found
          </h2>
        </div>
        <div className="govuk-notification-banner__content">
          <h3>
            We found {beacons.length}{" "}
            {beacons.length > 1 ? "beacons" : "beacon"} previously registered to{" "}
            {accountHolderDetails.email}.
          </h3>
          <details className="govuk-details">
            <summary className="govuk-details__summary">
              <span className="govuk-details__summary-text">
                More information about legacy beacons
              </span>
            </summary>

            <div className="govuk-details__text">
              <h3>Why can I see these beacons?</h3>
              <p>
                The new Maritime and Coastguard Beacon Registry Service was
                brought online in 2021. We have made every effort to move your
                beacon records (registered through the old service) to your new
                new customer account. We do this by matching the email address
                on your old records to the email address used to create your new
                customer account.
              </p>
              <h3>
                Why am I being asked to review and confirm if these beacons are
                mine?
              </h3>
              <p>
                To ensure we have correctly matched a beacon to you, we ask all
                customers to review and confirm the beacons are theirs.
                <br />
                <br />
                Due to Data Protection rules and regulation, we are unable to
                display any personally identifiable information, so please
                ensure to check the HEX ID/UIN or other information shown is
                yours.
                <br />
                <br />
                Once you confirm the beacon is yours, you will be asked to
                provide additional personal and beacon use information, vital to
                Search and Rescue.
                <br />
                <br />
                Only when a beacon record has been confirmed as yours, will you
                then be able to view, edit and delete your beacon information
                from your online customer account.
              </p>
              <h3>Why can I see beacons that are not mine?</h3>
              <p>
                To ensure we have correctly matched a beacon to you, we ask all
                customers to review and confirm the beacons are theirs.
                <br />
                <br />
                We may have matched a beacon to you because it was previously
                registered to the same email address. You can delete any beacons
                from your account that are not yours. By doing this you will no
                longer see it when you log in, but Search and rescue will still
                have a record of it in an emergency.
              </p>
              <h3>
                Is any of the information I previously provided about my
                beacon(s) lost?
              </h3>
              <p>
                We have copied across all previously registered beacons to the
                new service and this is available to Search and Rescue.
                <br />
                <br />
                Due to technical reasons, some of the information we copy across
                appears in a slightly different format when you view it in your
                Beacon Registry Account. However, no information is lost. Please
                check and update any of your records to ensure your information
                is up to date.
              </p>
              <h3>
                I registered beacons using the old service, but I cannot see
                them here
              </h3>
              <p>
                You may have registered those beacons with a different email
                address. Please re-register any beacons using the &quot;Register
                a new beacon&quot; button below. This is the safest way to
                ensure we have the correct information, in case the beacon is
                activated
              </p>
              <h3>
                Do I need to review and confirm my beacons now? Or can I do this
                at a later date?
              </h3>
              <p>
                Your beacon information will always be visible to Search and
                Rescue, even if you choose not to review and confirm if the
                beacon information belongs to you.
                <br />
                <br />
                You can choose to review and confirm beacon information at any
                time.
                <br />
                <br />
                But we recommend that all customers review and confirm their
                beacon record(s) because it provides Search and Rescue with the
                most up to date information in an emergency. It also enables
                customers to manage beacon information online themselves.
              </p>
              <h3>
                What is the benefit of registering and managing my beacon(s)
                online?
              </h3>
              <p>
                The new online Beacons Registry Service gives customers greater
                control over their beacon information.
                <br />
                <br />
                Customers can now register as many beacons as they like, make
                changes to their beacon records and delete a beacon from their
                account instantly, without delays.
              </p>
            </div>
          </details>
        </div>
      </div>
    );
  };

export default LegacyBeaconsNotification;
