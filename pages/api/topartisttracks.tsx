import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { parseCookies } from "nookies";
import { spotifyAPI } from "../../lib/utils";
import { ResponseType } from "./checkLogin";
import { SpotifyArtistAlbumsAPIResponse, SpotifyAlbumAPIResponse } from "../../lib/types/spotifyapi";

const topartisttracks: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {

    const { user } = parseCookies(res);
    const  accessToken = JSON.parse(user).access_token;

    const api = new spotifyAPI(accessToken);
    const artistsRes = await api.fetcher.get("/me/top/artists");
    const topArtists = artistsRes.data.items;
    const albums = await Promise.all(topArtists.map( async (artist: any) => {
        const albumResponse = await api.fetcher.get<SpotifyArtistAlbumsAPIResponse>(`/artists/${artist.id}/albums`, {
            params: {
                include_groups: "album"
            }
        } 
        );
        return albumResponse.data
    }))
    res.status(200).json(albums);
}

export default topartisttracks