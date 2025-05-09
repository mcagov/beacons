import { GetServerSideProps, GetServerSidePropsResult } from "next";
import React, { FunctionComponent } from "react";
import { v4 as uuidv4 } from "uuid";
import { LinkButton } from "../../components/Button";
import LegacyBeaconsNotification from "../../components/domain/LegacyBeaconsNotification";
import { Layout } from "../../components/Layout";
import { BeaconRegistryContactInfo } from "../../components/Mca";
import {
  AnchorLink,
  PageHeading,
  SectionHeading,
  WarningLink,
} from "../../components/Typography";
import { AccountHolder } from "../../entities/AccountHolder";
import { AccountListBeacon } from "../../entities/AccountListBeacon";
import { DraftRegistration } from "../../entities/DraftRegistration";
import { setCookie } from "../../lib/middleware";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../lib/middleware/withContainer";
import { withSession } from "../../lib/middleware/withSession";
import { formSubmissionCookieId } from "../../lib/types";
import {
  AccountPageURLs,
  ActionURLs,
  ClaimPageURLs,
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
import { pluralize } from "../../lib/utils";

export interface YourBeaconRegistryAccountPageProps {
  id?: string;
  accountHolderDetails: AccountHolder;
  beacons: AccountListBeacon[];
  signOutUri: string;
}

export const YourBeaconRegistryAccount: FunctionComponent<
  YourBeaconRegistryAccountPageProps
> = ({
  accountHolderDetails,
  beacons,
  signOutUri,
}: YourBeaconRegistryAccountPageProps): JSX.Element => {
  const pageHeading = "Your Beacon Registry Account";
  const legacyBeacons = beacons.filter(
    (beacon) => beacon.beaconStatus === "MIGRATED",
  );
  return (
    <Layout
      title={pageHeading}
      showCookieBanner={false}
      signOutUri={signOutUri}
    >
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-three-thirds">
          <PageHeading>{pageHeading}</PageHeading>
          <YourDetails accountHolderDetails={accountHolderDetails} />
          {legacyBeacons.length > 0 && (
            <LegacyBeaconsNotification
              beacons={legacyBeacons}
              accountHolderDetails={accountHolderDetails}
            />
          )}

          <YourBeacons
            beacons={beacons.filter(({ beaconStatus }) =>
              ["NEW", "CHANGE"].includes(beaconStatus),
            )}
            filter="MODERN"
          />

          {legacyBeacons && legacyBeacons.length > 0 && (
            <YourBeacons beacons={legacyBeacons} filter="MIGRATED" />
          )}

          <RegisterANewBeacon />
          <Contact />
        </div>
      </div>
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
    country,
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
            {country && (
              <view>
                <br />
                {country}
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
  filter: string;
}

const YourBeacons: FunctionComponent<IYourBeaconsProps> = ({
  beacons,
  filter,
}: IYourBeaconsProps): JSX.Element => (
  <>
    <table className="govuk-table">
      <caption className="govuk-table__caption govuk-table__caption--m">
        {filter === "MIGRATED"
          ? `You have ${beacons ? beacons.length : 0} ${pluralize(
              beacons.length,
              "beacon",
            )} that have not yet been claimed`
          : `You have ${beacons ? beacons.length : 0} registered ${pluralize(
              beacons.length,
              "beacon",
            )}`}
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
            Main use
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
        {["NEW", "CHANGE"].includes(beacon.beaconStatus) ? (
          <th scope="row" className="govuk-table__header">
            <AnchorLink
              href={UrlBuilder.buildRegistrationUrl(
                Actions.update,
                Pages.summary,
                beacon.id,
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
        <td className="govuk-table__cell">
          {beacon.mainUse ? beacon.mainUse : "-"}
        </td>
        <td className="govuk-table__cell">{beacon.createdDate}</td>
        <td className="govuk-table__cell">{beacon.lastModifiedDate}</td>
        <td className="govuk-table__cell">
          {["NEW", "CHANGE"].includes(beacon.beaconStatus) ? (
            <>
              <div style={{ marginBottom: "8px" }}>
                <AnchorLink
                  href={UrlBuilder.buildRegistrationUrl(
                    Actions.update,
                    Pages.summary,
                    beacon.id,
                  )}
                  classes="govuk-link--no-visited-state"
                >
                  Update
                </AnchorLink>
              </div>
              <div>
                <WarningLink href={confirmBeforeDelete(beacon.id)}>
                  Delete
                </WarningLink>
              </div>
            </>
          ) : (
            <a
              href={`${ClaimPageURLs.claimBeacon}/${beacon.id}`}
              className="govuk-link--no-visited-state"
            >
              Claim this beacon
            </a>
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
      href={ActionURLs.clearAndCheckBeaconDetails}
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
      new WhenWeDoNotKnowUserDetails_ThenAskUserForTheirDetails(context),
      new IfUserIsSignedInAndHasValidAccountDetails(context),
    ]).execute();
  }),
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
      accountHolderDetails.email,
    );
    await this.createDraftRegistrationIfNoneForUser();

    return {
      props: {
        accountHolderDetails,
        beacons,
        signOutUri: AccountPageURLs.signOut,
      },
    };
  }

  private async getBeacons(
    accountHolderId: string,
    email: string,
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
