import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { parseCookies } from "nookies";
import { SpotifyArtistAPIResponse, SpotifyPluralResponse } from "../../../lib/types/spotifyapi";
import { spotifyAPI } from "../../../lib/utils";

const userTop: NextApiHandler<Array<SpotifyArtistAPIResponse>> = async (req: NextApiRequest, res: NextApiResponse) => {

    const { limit } = req.query;
    const { user } = parseCookies(res);
    const accessToken = JSON.parse(user).access_token;
    const api = new spotifyAPI(accessToken);
    const artistRes = await api.fetcher<SpotifyPluralResponse<SpotifyArtistAPIResponse>>("/me/top/artists", {
        params: {
            limit: limit ? limit : 20
        }
    });
    res.status(200).json(artistRes.data.items)
}

export default userTop