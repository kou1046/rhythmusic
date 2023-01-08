import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { parseCookies } from "nookies";
import { spotifyAPI } from "../../../lib/utils";

const create:NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { user } = parseCookies(res);
    const { userID, name, uris } = req.body;
    const accessToken = JSON.parse(user).access_token;
    const api = new spotifyAPI(accessToken);
    
    const response = await api.fetcher.post(`/users/${userID}/playlists`, 
    { name },
    {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const { id } = response.data;
    await api.fetcher.post(`/playlists/${id}/tracks/`, { uris },
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    )
    res.status(200).end();
}

export default create