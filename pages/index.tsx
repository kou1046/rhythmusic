import { GetStaticProps } from 'next'
import { useEffect, useState } from 'react';
import { parseCookies } from "nookies"
import axios from 'axios';
import { LoginButton } from './components/LoginButton';
import { LogoutButton } from './components/LogoutButton';
import { useLogin } from '../hooks/useLogin';

export const getStaticProps: GetStaticProps<pageProps> = async () => {
  return { props : {
    clientID: process.env.CLIENT_ID as string, 
    clientSecret: process.env.CLIENT_SECRET as string,
    redirectUri: process.env.REDIRECT_URI as string
  }}
}

type pageProps = {
  clientID: string,
  clientSecret: string, 
  redirectUri: string
}

export default function Home(pageprops: pageProps) {

  const {data, error, isValidating, mutate} = useLogin();

  return (
    <>
      {data?.accessToken ? <LogoutButton loginMutate={ mutate }/>: <LoginButton { ...pageprops }></LoginButton>}
    </>
  )
}
