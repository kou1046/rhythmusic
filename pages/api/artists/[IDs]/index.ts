import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { parseCookies } from "nookies";
import { SpotifyArtistAPIResponse } from "../../../../lib/types/spotifyapi"
import { spotifyAPI } from "../../../../lib/utils";

const index:NextApiHandler<Array<SpotifyArtistAPIResponse>> =  async (req: NextApiRequest, res: NextApiResponse) => {
    const IDs = (req.query.IDs as string).split(",");
    const { user } = parseCookies(res);
    const accessToken = JSON.parse(user).access_token;
    const api = new spotifyAPI(accessToken);

    const response = await api.fetcher.get<{ artists: Array<SpotifyArtistAPIResponse> }>(
        `/api/artists/?=${IDs}`
    )
    res.status(200).json(response.data.artists);

} 

export default index