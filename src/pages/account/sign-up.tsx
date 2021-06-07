
import {useEffect} from 'react'

const tenantName = process.env.NEXT_PUBLIC_AZURE_B2C_TENANT_NAME;
const userFlow = process.env.NEXT_PUBLIC_AZURE_B2C_SIGNUP_FLOW;
const clientId = process.env.NEXT_PUBLIC_AZURE_B2C_CLIENT_ID;
const redirectUri = process.env.NEXT_PUBLIC_BASE_URL + "\/account\/sign-in";

const signupUri = `https://${tenantName}.b2clogin.com/${tenantName}.onmicrosoft.com/${userFlow}/oauth2/v2.0/authorize?p=${userFlow}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=openid&response_type=id_token&prompt=login`;

export default function redirect() {

    useEffect(() => {
        window.location.assign(signupUri)
    })
    return(
        <>
        </>
    )
    
}