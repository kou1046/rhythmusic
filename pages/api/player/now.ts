import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { parseCookies } from "nookies";
import { spotifyAPI } from "../../../lib/utils";

const play:NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { user } = parseCookies(res);
    const accessToken = JSON.parse(user).access_token;
    const api = new spotifyAPI(accessToken);

    const response = await api.fetcher.get("/me/player/currently-playing", {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    res.status(200).json(response.data);
}

export default play