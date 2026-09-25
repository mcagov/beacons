import { GetServerSideProps } from "next";
import { signIn } from "next-auth/react";
import React, { FunctionComponent, useEffect, useState, type JSX } from "react";
import { Button } from "../../components/Button";
import { FormErrorSummary } from "../../components/ErrorSummary";
import { FormGroup } from "../../components/Form";
import { Grid } from "../../components/Grid";
import { Input } from "../../components/Input";
import { Layout } from "../../components/Layout";
import { GovUKBody, PageHeading } from "../../components/Typography";
import { isLocalAuthEnabled, localAuthProviderId } from "../../lib/localAuth";
import { AccountPageURLs } from "../../lib/urls";

interface SignInPageProps {
  callbackUrl: string;
  localAuthEnabled: boolean;
}

const SignInPage: FunctionComponent<SignInPageProps> = ({
  callbackUrl,
  localAuthEnabled,
}: SignInPageProps): JSX.Element => {
  if (localAuthEnabled) {
    return <LocalSignInForm callbackUrl={callbackUrl} />;
  }

  return <RedirectToB2C callbackUrl={callbackUrl} />;
};

const RedirectToB2C: FunctionComponent<{ callbackUrl: string }> = ({
  callbackUrl,
}): JSX.Element => {
  useEffect(() => {
    signIn("azureb2c", { callbackUrl });
  });
  return <></>;
};

const LocalSignInForm: FunctionComponent<{ callbackUrl: string }> = ({
  callbackUrl,
}): JSX.Element => {
  const [error, setError] = useState<string>(null);
  const pageHeading = "Sign In using my Beacon Registry Account";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const result = await signIn(localAuthProviderId, {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });

    if (result?.ok) {
      window.location.assign(callbackUrl);
    } else {
      setError(
        "Those credentials do not match LOCAL_AUTH_EMAIL and LOCAL_AUTH_PASSWORD in your environment",
      );
    }
  };

  return (
    <Layout
      title={pageHeading}
      showCookieBanner={false}
      pageHasErrors={error != null}
    >
      <Grid
        mainContent={
          <>
            <FormErrorSummary
              formErrors={
                error ? [{ fieldId: "email", errorMessages: [error] }] : []
              }
            />
            <PageHeading>{pageHeading}</PageHeading>
            <GovUKBody>
              Local development sign-in. This page stands in for the Azure B2C
              hosted sign-in page and accepts the single account configured in
              your <code>.envrc</code>.
            </GovUKBody>
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Input
                  id="email"
                  label="Email address"
                  type="email"
                  htmlAttributes={{ autoComplete: "username", required: true }}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  id="password"
                  label="Password"
                  type="password"
                  htmlAttributes={{
                    autoComplete: "current-password",
                    required: true,
                  }}
                />
              </FormGroup>
              <Button buttonText="Sign in" />
            </form>
          </>
        }
      />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const callbackUrl = process.env.NEXTAUTH_URL + AccountPageURLs.accountHome;
  return { props: { callbackUrl, localAuthEnabled: isLocalAuthEnabled() } };
};

export default SignInPage;
