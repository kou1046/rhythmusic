import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { setCookie } from 'nookies';
import { SpotifyAuthApiResponse } from '../../../lib/types/spotifyapi';

const authorization: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { code, state } = req.query;

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code as string);
  params.append('redirect_uri', process.env.REDIRECT_URI as string);

  const response = await axios.post<SpotifyAuthApiResponse>(
      'https://accounts.spotify.com/api/token',
      params,
      {
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`, 'utf-8').toString('base64')}`
          }
      }
  );

  setCookie({ res }, "user", JSON.stringify(response.data), {
    path: "/",
    httpOnly: true,
    SameSite: "Strict",
  })
  res.redirect(`${process.env.HOST_NAME}/app`);
};
 
export default authorization