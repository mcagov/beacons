import { GetServerSideProps } from "next";
import { signOut } from "next-auth/client";
import React, { FunctionComponent } from "react";
import { Layout } from "../../components/Layout";
import { GovUKBody, PageHeading } from "../../components/Typography";
import { AccountPageURLs, GeneralPageURLs } from "../../lib/urls";

interface SignOutProps {
  federatedSignOutUrl: string;
}

export const SignOut: FunctionComponent<SignOutProps> = ({
  federatedSignOutUrl,
}): JSX.Element => {
  const logoutHandler = async () => {
    await signOut();
    window.location.assign(federatedSignOutUrl);
  };

  const pageHeading = "Are you sure you want to sign out?";
  return (
    <Layout title={pageHeading} showCookieBanner={false}>
      <PageHeading>{pageHeading}</PageHeading>
      <GovUKBody>
        <>
          <div className="govuk-button-group">
            <button className="govuk-button" onClick={logoutHandler}>
              Yes, I want to sign out
            </button>
            <a
              className="govuk-link--no-visited-state"
              href={AccountPageURLs.accountHome}
            >
              No, take me back to my account
            </a>
          </div>
        </>
      </GovUKBody>
    </Layout>
  );
};

export default SignOut;

export const getServerSideProps: GetServerSideProps<SignOutProps> =
  async () => {
    const federatedSignOutUrl = `https://${process.env.AZURE_B2C_TENANT_NAME}\
.b2clogin.com/${process.env.AZURE_B2C_TENANT_NAME}\
.onmicrosoft.com/${process.env.AZURE_B2C_LOGIN_FLOW}\
/oauth2/v2.0/logout?post_logout_redirect_uri=\
${process.env.NEXTAUTH_URL}${GeneralPageURLs.start}`;

    return {
      props: {
        federatedSignOutUrl,
      },
    };
  };
