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
import { Resources } from "../../lib/URLs/Resources";
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

export const YourBeaconRegistryAccount: FunctionComponent<YourBeaconRegistryAccountPageProps> =
  ({
    accountHolderDetails,
    beacons,
  }: YourBeaconRegistryAccountPageProps): JSX.Element => {
    const pageHeading = "Your Beacon Registry Account";

    return (
      <Layout title={pageHeading} showCookieBanner={false}>
        <Grid
          mainContent={
            <>
              <PageHeading>{pageHeading}</PageHeading>
              <YourDetails accountHolderDetails={accountHolderDetails} />
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
        <th scope="row" className="govuk-table__header">
          <AnchorLink
            href={UrlBuilder.build(
              Resources.registration,
              Actions.update,
              Pages.summary,
              beacon.id
            )}
            classes="govuk-link--no-visited-state"
          >
            {beacon.hexId}
          </AnchorLink>
        </th>
        <td className="govuk-table__cell">{beacon.ownerName}</td>
        <td className="govuk-table__cell">{beacon.uses}</td>
        <td className="govuk-table__cell">{beacon.createdDate}</td>
        <td className="govuk-table__cell">{beacon.lastModifiedDate}</td>
        <td className="govuk-table__cell">
          <AnchorLink
            href={UrlBuilder.build(
              Resources.registration,
              Actions.update,
              Pages.summary,
              beacon.id
            )}
            classes="govuk-link--no-visited-state"
          >
            Update
          </AnchorLink>{" "}
          <AnchorLink
            href={confirmBeforeDelete(beacon.id)}
            classes="govuk-link--no-visited-state"
          >
            Delete
          </AnchorLink>
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
