import { GetServerSideProps, GetServerSidePropsResult } from "next";
import React, { FunctionComponent } from "react";
import { v4 as uuidv4 } from "uuid";
import { LinkButton } from "../../components/Button";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import { BeaconRegistryContactInfo } from "../../components/Mca";
import {
  AnchorLink,
  PageHeading,
  SectionHeading,
} from "../../components/Typography";
import { AccountHolder } from "../../entities/AccountHolder";
import { AccountListBeacon } from "../../entities/AccountListBeacon";
import { DraftRegistration } from "../../entities/DraftRegistration";
import { accountDetailsFormManager } from "../../lib/form/formManagers/accountDetailsFormManager";
import { setCookie } from "../../lib/middleware";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../lib/middleware/withContainer";
import { withSession } from "../../lib/middleware/withSession";
import { formSubmissionCookieId } from "../../lib/types";
import {
  AccountPageURLs,
  CreateRegistrationPageURLs,
  DeleteRegistrationPageURLs,
  queryParams,
} from "../../lib/urls";
import { Actions } from "../../lib/URLs/Actions";
import { Pages } from "../../lib/URLs/Pages";
import { UrlBuilder } from "../../lib/URLs/UrlBuilder";
import { BeaconsPageRouter } from "../../router/BeaconsPageRouter";
import { Rule } from "../../router/rules/Rule";
import { WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError } from "../../router/rules/WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError";
import { WhenWeDoNotKnowUserDetails_ThenAskUserForTheirDetails } from "../../router/rules/WhenWeDoNotKnowUserDetails_ThenAskUserForTheirDetails";

export interface YourBeaconRegistryAccountPageProps {
  id?: string;
  accountHolderDetails: AccountHolder;
  beacons: AccountListBeacon[];
}

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

export const YourBeaconRegistryAccount: FunctionComponent<YourBeaconRegistryAccountPageProps> =
  ({
    accountHolderDetails,
    beacons,
  }: YourBeaconRegistryAccountPageProps): JSX.Element => {
    const pageHeading = "Your Beacon Registry Account";
    const legacyBeacons = beacons.filter((beacon) => {
      return beacon.beaconStatus === "MIGRATED";
    });

    return (
      <Layout title={pageHeading} showCookieBanner={false}>
        <Grid
          mainContent={
            <>
              <PageHeading>{pageHeading}</PageHeading>
              <YourDetails accountHolderDetails={accountHolderDetails} />
              {legacyBeacons.length > 0 && (
                <LegacyBeaconsNotification
                  beacons={legacyBeacons}
                  accountHolderDetails={accountHolderDetails}
                />
              )}
              <YourBeacons beacons={beacons} />
              <RegisterANewBeacon />
              <Contact />
            </>
          }
        />
      </Layout>
    );
  };

interface IYourDetailsProps {
  accountHolderDetails: AccountHolder;
}

const YourDetails: FunctionComponent<IYourDetailsProps> = ({
  accountHolderDetails: {
    fullName,
    telephoneNumber,
    alternativeTelephoneNumber,
    addressLine1,
    addressLine2,
    addressLine3,
    addressLine4,
    townOrCity,
    county,
    postcode,
    email,
  },
}: IYourDetailsProps): JSX.Element => {
  return (
    <>
      <div
        className="govuk-!-margin-bottom-4"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <SectionHeading classes="govuk-!-margin-0">Your details</SectionHeading>
        <div>
          <AnchorLink
            href={AccountPageURLs.updateAccount}
            classes="govuk-link--no-visited-state govuk-!-margin-right-4"
            description="Your details"
          >
            Change
          </AnchorLink>
        </div>
      </div>
      <dl className="govuk-summary-list">
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Account holder details</dt>
          <dd className="govuk-summary-list__value">
            {fullName}
            <br />
            {telephoneNumber}
            {alternativeTelephoneNumber && (
              <view>
                <br />
                {alternativeTelephoneNumber}
              </view>
            )}
          </dd>
        </div>

        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Account holder address</dt>
          <dd className="govuk-summary-list__value">
            <view>{addressLine1}</view>
            {addressLine2 && (
              <view>
                <br />
                {addressLine2}
              </view>
            )}
            {addressLine3 && (
              <view>
                <br />
                {addressLine3}
              </view>
            )}
            {addressLine4 && (
              <view>
                <br />
                {addressLine4}
              </view>
            )}
            {addressLine4 && (
              <view>
                <br />
                {addressLine4}
              </view>
            )}
            {addressLine4 && (
              <view>
                <br />
                {addressLine4}
              </view>
            )}
            {townOrCity && (
              <view>
                <br />
                {townOrCity}
              </view>
            )}
            {county && (
              <view>
                <br />
                {county}
              </view>
            )}
            {postcode && (
              <view>
                <br />
                {postcode}
              </view>
            )}
          </dd>
        </div>

        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Log in details</dt>
          <dd className="govuk-summary-list__value">
            <view>{email}</view>
            <view>
              <br />
            </view>
          </dd>
        </div>
      </dl>
    </>
  );
};

interface IYourBeaconsProps {
  beacons: AccountListBeacon[];
}

const YourBeacons: FunctionComponent<IYourBeaconsProps> = ({
  beacons,
}: IYourBeaconsProps): JSX.Element => (
  <>
    <table className="govuk-table">
      <caption className="govuk-table__caption govuk-table__caption--m">
        You have {beacons ? beacons.length : 0} registered beacons
      </caption>
      <thead className="govuk-table__head">
        <tr className="govuk-table__row">
          <th scope="col" className="govuk-table__header">
            Hex ID/UIN
          </th>
          <th scope="col" className="govuk-table__header">
            Owner
          </th>
          <th scope="col" className="govuk-table__header">
            Used for
          </th>
          <th scope="col" className="govuk-table__header">
            First registered
          </th>
          <th scope="col" className="govuk-table__header">
            Last updated
          </th>
          <th scope="col" className="govuk-table__header">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="govuk-table__body">
        {beacons.map((b, i) => (
          <BeaconRow beacon={b} key={i} />
        ))}
      </tbody>
    </table>
  </>
);

interface BeaconRowProps {
  beacon: AccountListBeacon;
}

const BeaconRow: FunctionComponent<BeaconRowProps> = ({
  beacon,
}: BeaconRowProps): JSX.Element => {
  const confirmBeforeDelete = (registrationId: string) =>
    DeleteRegistrationPageURLs.deleteRegistration +
    queryParams({
      id: registrationId,
    });

  return (
    <>
      <tr className="govuk-table__row">
        {beacon.beaconStatus === "NEW" ? (
          <th scope="row" className="govuk-table__header">
            <AnchorLink
              href={UrlBuilder.buildRegistrationUrl(
                Actions.update,
                Pages.summary,
                beacon.id
              )}
              classes="govuk-link--no-visited-state"
            >
              {beacon.hexId}
            </AnchorLink>
          </th>
        ) : (
          <td className="govuk-table__cell">{beacon.hexId}</td>
        )}

        <td className="govuk-table__cell">
          {beacon.ownerName ? beacon.ownerName : "-"}
        </td>
        <td className="govuk-table__cell">{beacon.uses ? beacon.uses : "-"}</td>
        <td className="govuk-table__cell">{beacon.createdDate}</td>
        <td className="govuk-table__cell">{beacon.lastModifiedDate}</td>
        <td className="govuk-table__cell">
          {beacon.beaconStatus === "NEW" ? (
            <AnchorLink
              href={confirmBeforeDelete(beacon.id)}
              classes="govuk-link--no-visited-state"
            >
              Delete
            </AnchorLink>
          ) : (
            <td className="govuk-table__cell">-</td>
          )}
        </td>
      </tr>
    </>
  );
};

const RegisterANewBeacon: FunctionComponent = (): JSX.Element => (
  <>
    <SectionHeading>Register a new beacon</SectionHeading>
    <LinkButton
      buttonText="Register a new beacon"
      href={CreateRegistrationPageURLs.checkBeaconDetails}
    />
  </>
);

const Contact: FunctionComponent = (): JSX.Element => (
  <>
    <SectionHeading>Contact the UK Beacon Registry</SectionHeading>
    <BeaconRegistryContactInfo />
  </>
);

export const getServerSideProps: GetServerSideProps = withSession(
  withContainer(async (context: BeaconsGetServerSidePropsContext) => {
    return await new BeaconsPageRouter([
      new WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError(context),
      new WhenWeDoNotKnowUserDetails_ThenAskUserForTheirDetails(
        context,
        accountDetailsFormManager
      ),
      new IfUserIsSignedInAndHasValidAccountDetails(context),
    ]).execute();
  })
);

class IfUserIsSignedInAndHasValidAccountDetails implements Rule {
  constructor(private readonly context: BeaconsGetServerSidePropsContext) {}

  public async condition(): Promise<boolean> {
    return this.context.req.method === "GET";
  }

  public async action(): Promise<GetServerSidePropsResult<any>> {
    const accountHolderDetails = await this.getAccountHolderDetails();
    const beacons = await this.getBeacons(
      accountHolderDetails.id,
      accountHolderDetails.email
    );
    await this.createDraftRegistrationIfNoneForUser();

    return {
      props: {
        accountHolderDetails,
        beacons,
      },
    };
  }

  private async getBeacons(
    accountHolderId: string,
    email: string
  ): Promise<AccountListBeacon[]> {
    const { getBeaconsForAccountHolder } = this.context.container;

    return getBeaconsForAccountHolder(accountHolderId, email, {
      column: "lastModifiedDate",
      direction: "desc",
    });
  }

  private async getAccountHolderDetails() {
    const { getOrCreateAccountHolder } = this.context.container;

    return getOrCreateAccountHolder(this.context.session);
  }

  private async createDraftRegistrationIfNoneForUser() {
    if (!this.context.req.cookies?.[formSubmissionCookieId]) {
      const { saveDraftRegistration } = this.context.container;

      const draftRegistrationId: string = uuidv4();
      const emptyDraftRegistration: DraftRegistration = {
        uses: [],
      };

      await saveDraftRegistration(draftRegistrationId, emptyDraftRegistration);

      setCookie(this.context.res, formSubmissionCookieId, draftRegistrationId);
    }
  }
}

export default YourBeaconRegistryAccount;
