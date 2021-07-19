import { GetServerSideProps } from "next";
import { signIn } from "next-auth/client";
import React, { FunctionComponent, useEffect } from "react";
import { PageURLs } from "../../lib/urls";

interface SignInPageProps {
  callbackUrl: string;
}

const SignInPage: FunctionComponent<SignInPageProps> = ({
  callbackUrl,
}: SignInPageProps): JSX.Element => {
  useEffect(() => {
    signIn("azureb2c", { callbackUrl });
  });
  return <></>;
};

export const getServerSideProps: GetServerSideProps = async () => {
  const callbackUrl = process.env.NEXTAUTH_URL + PageURLs.updateHome;
  return { props: { callbackUrl } };
};

export default SignInPage;
