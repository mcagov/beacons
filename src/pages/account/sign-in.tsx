import { GetServerSideProps } from "next";
import { signIn } from "next-auth/client";
import React, { FunctionComponent, useEffect } from "react";

interface SignInPageProps {
  baseUrl: string;
}

const SignInPage: FunctionComponent<SignInPageProps> = ({
  baseUrl,
}: SignInPageProps): JSX.Element => {
  useEffect(() => {
    signIn("azureb2c", { callbackUrl: baseUrl });
  });
  return <></>;
};

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: { baseUrl: process.env.NEXTAUTH_URL } };
};

export default SignInPage;
