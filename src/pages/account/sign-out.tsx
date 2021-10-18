import { signOut } from "next-auth/client";
import React, { FunctionComponent } from "react";
import { Layout } from "../../components/Layout";
import { GovUKBody, PageHeading } from "../../components/Typography";
import { AccountPageURLs, GeneralPageURLs } from "../../lib/urls";

export const SignOut: FunctionComponent = (): JSX.Element => {
  const federatedLoginSignOutUri = `https://${process.env.AZURE_B2C_TENANT_NAME}
    .b2clogin.com/${process.env.AZURE_B2C_TENANT_NAME}
    .onmicrosoft.com/${process.env.AZURE_B2C_LOGIN_FLOW}
    /oauth2/v2.0/logout?post_logout_redirect_uri=
    ${process.env.NEXTAUTH_URL}${GeneralPageURLs.start}`;

  const pageHeading = "Are you sure you want to sign out?";
  return (
    <Layout title={pageHeading} showCookieBanner={false}>
      <PageHeading>{pageHeading}</PageHeading>
      <GovUKBody>
        <>
          <div className="govuk-button-group">
            <button
              className="govuk-button"
              onClick={() => signOut({ callbackUrl: federatedLoginSignOutUri })}
            >
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
