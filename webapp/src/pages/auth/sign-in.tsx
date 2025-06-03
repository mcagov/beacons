import { signIn } from "next-auth/react";
import React, { useEffect } from "react";
import { Layout } from "../../components/Layout";
import { PageHeading, GovUKBody } from "../../components/Typography";

export default function SignIn() {
  useEffect(() => {
    signIn("azure-ad-b2c");
  }, []);

  return (
    <Layout title="Sign in" showCookieBanner={false}>
      <PageHeading>Signing you in to your Beacon Registry account…</PageHeading>
      <GovUKBody>
        Redirecting you to the Beacon Registry sign in page. If you are not
        redirected,{" "}
        <a href="#" onClick={() => signIn("azure-ad-b2c")}>
          click here
        </a>
        .
      </GovUKBody>
    </Layout>
  );
}
