import { signIn } from 'next-auth/client';
import {useEffect} from 'react'

const redirectUri = process.env.NEXT_PUBLIC_BASE_URL;

export default function redirect() {

    useEffect(() => {
        signIn("azureb2c", {callbackUrl :redirectUri});
    })
    return(
        <>
        </>
    )
    
}