import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { parseCookies } from "nookies";
import { spotifyAPI } from "../../../lib/utils";

const play:NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { deviceID } = req.query;
    const { uris } = req.body;
    const { user } = parseCookies(res);
    const accessToken = JSON.parse(user).access_token;
    const api = new spotifyAPI(accessToken);

    await api.fetcher.put(`/me/player/play/?device_id=${deviceID}`, { uris }, {
        headers: {
            'Content-Type': 'application/json',
        }
    }).catch(e => console.log(e));
    res.status(200).end();
}

export default play