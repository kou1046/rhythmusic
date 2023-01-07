import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { parseCookies } from "nookies";
import { SpotifyArtistAPIResponse, SpotifyPluralResponse } from "../../lib/types/spotifyapi";
import { spotifyAPI } from "../../lib/utils";

const artistSearch:NextApiHandler<Array<SpotifyArtistAPIResponse>>  = async (req: NextApiRequest, res: NextApiResponse) => {
    const { q } = req.query;
    const { user } = parseCookies(res);
    console.log(user);
    const accessToken = JSON.parse(user).access_token;
    const api = new spotifyAPI(accessToken);

    const response = await api.fetcher.get<{ artists: SpotifyPluralResponse<SpotifyArtistAPIResponse> }> (
        `/search/?type=artist&q=${q}`,
    )
    res.status(200).json(response.data.artists.items);
}

export default artistSearch