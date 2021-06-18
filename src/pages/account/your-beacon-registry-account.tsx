import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import { BeaconRegistryContactInfo } from "../../components/Mca";
import { PageHeading, SectionHeading } from "../../components/Typography";
import { IAccountBeacon } from "../../lib/accountHolder/accountBeacons";
import { IAccountHolderDetails } from "../../lib/accountHolder/accountHolderDetails";
import {
  BeaconsGetServerSidePropsContext,
  withContainer,
} from "../../lib/container";

interface YourBeaconRegistyAccountPageProps {
  id?: string;
  accountHolderDetails: IAccountHolderDetails;
  beacons: IAccountBeacon[];
}

export const YourBeaconRegistyAccount: FunctionComponent<YourBeaconRegistyAccountPageProps> =
  (props: YourBeaconRegistyAccountPageProps): JSX.Element => {
    const pageHeading = "Your Beacon Registy Account";

    return (
      <Layout title={pageHeading} showCookieBanner={false}>
        <Grid
          mainContent={
            <>
              <PageHeading>{pageHeading}</PageHeading>
              <YourDetails
                accountHolderDetails={props.accountHolderDetails}
              ></YourDetails>
              <YourBeacons beacons={props.beacons}></YourBeacons>
              <RegisterANewBeacon></RegisterANewBeacon>
              <Contact></Contact>
            </>
          }
        />
      </Layout>
    );
  };

interface IYourDetailsProps {
  accountHolderDetails: IAccountHolderDetails;
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
      <SectionHeading>Your details</SectionHeading>
      <dl className="govuk-summary-list">
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Account holder details</dt>
          <dd className="govuk-summary-list__value">
            {fullName}
            <br></br>
            {telephoneNumber}
            {alternativeTelephoneNumber && (
              <view>
                <br></br>
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
                <br></br>
                {addressLine2}
              </view>
            )}
            {addressLine3 && (
              <view>
                <br></br>
                {addressLine3}
              </view>
            )}
            {addressLine4 && (
              <view>
                <br></br>
                {addressLine4}
              </view>
            )}
            {addressLine4 && (
              <view>
                <br></br>
                {addressLine4}
              </view>
            )}
            {addressLine4 && (
              <view>
                <br></br>
                {addressLine4}
              </view>
            )}
            {townOrCity && (
              <view>
                <br></br>
                {townOrCity}
              </view>
            )}
            {county && (
              <view>
                <br></br>
                {county}
              </view>
            )}
            {postcode && (
              <view>
                <br></br>
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
              <br></br>
              ********
            </view>
          </dd>
        </div>
      </dl>
    </>
  );
};

interface IYourBeaconsProps {
  beacons: IAccountBeacon[];
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
            User for
          </th>
          <th scope="col" className="govuk-table__header">
            Registered
          </th>
          {/* <th scope="col" className="govuk-table__header">
            Actions
          </th> */}
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
  beacon: IAccountBeacon;
}

const BeaconRow: FunctionComponent<BeaconRowProps> = ({
  beacon,
}: BeaconRowProps): JSX.Element => (
  <>
    <tr className="govuk-table__row">
      <th scope="row" className="govuk-table__header">
        {beacon.hexId}
      </th>
      <td className="govuk-table__cell">beacon owner</td>
      <td className="govuk-table__cell">beacon uses</td>
      <td className="govuk-table__cell">{beacon.createdDate}</td>
      {/* <td className="govuk-table__cell">{}</td> */}
    </tr>
  </>
);

const RegisterANewBeacon: FunctionComponent = (): JSX.Element => (
  <>
    <SectionHeading>Register a new beacon</SectionHeading>
  </>
);

const Contact: FunctionComponent = (): JSX.Element => (
  <>
    <SectionHeading>Contact the UK Beacon Registry</SectionHeading>
    <BeaconRegistryContactInfo />
  </>
);

export const getServerSideProps: GetServerSideProps = withContainer(
  async (context: BeaconsGetServerSidePropsContext) => {
    const getAccountDetails = context.container.getAccountDetails;
    const getAccountBeacons = context.container.getAccountBeacons;

    const accountHolderDetails = await getAccountDetails(context);
    const beacons = await getAccountBeacons(accountHolderDetails.id);

    return {
      props: { accountHolderDetails, beacons },
    };
  }
);

export default YourBeaconRegistyAccount;
