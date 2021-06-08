import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { signIn } from 'next-auth/client';
import {FunctionComponent, useEffect} from 'react'

interface SignInPageProps {
    baseUrl: string;
  }

const SignInPage: FunctionComponent<SignInPageProps> = ({
    baseUrl,
  }: SignInPageProps): JSX.Element => {
      
    console.log("baseUrl", baseUrl);
    useEffect(() => {
        signIn("azureb2c", {callbackUrl :baseUrl});
    })
    return(
        <>
        </>
    );
    
};

export const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext
  ) => {
  
    console.log("baseUrl", process.env.NEXTAUTH_URL );
    return { props: { baseUrl: process.env.NEXTAUTH_URL } };
  };

  export default SignInPage;