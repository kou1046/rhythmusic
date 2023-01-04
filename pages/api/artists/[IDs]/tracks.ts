import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { parseCookies } from "nookies";
import { splitArray, spotifyAPI } from "../../../../lib/utils";
import { AudioFeature, SpotifyAlbumAPIResponse, SpotifyPluralResponse, 
         SpotifyTrackAPIResponse, TrackWithFeature } from "../../../../lib/types/spotifyapi";

const tracks: NextApiHandler<Array<Array<TrackWithFeature>>> = async (req: NextApiRequest, res: NextApiResponse) => {

    const IDs = (req.query.IDs as string).split(",");
    const { user } = parseCookies(res);
    const accessToken = JSON.parse(user).access_token;
    const api = new spotifyAPI(accessToken);

    const artistAlbums = await Promise.all(IDs.map( async ID => {
        const res = await api.fetcher.get<SpotifyPluralResponse<SpotifyAlbumAPIResponse>>(`/artists/${ID}/albums`, {
            params: {
                include_groups: "album,single"
            }
        });
        return res.data.items
    }))


    const artistTracks = await Promise.all(artistAlbums.map( async albums => {
        const albumDetails = await api.fetcher.get<{ albums: Array<SpotifyAlbumAPIResponse> }>(
            `/albums/?ids=${albums.map((({ id }) => id)).join(",")}`
            )
        return albumDetails.data.albums.map(album => album.tracks).flat()
                                       .map(ts => ts.items).flat()
    }))

    const splitArtistTracks = artistTracks.map(el => splitArray(el, 100)); //特徴量の取得に100曲ずつしかリクエストを送れないため，分割する必要がある
    const splitArtistTrackFeatures = await Promise.all(splitArtistTracks.map( async tracks => {
        const trackFeatures = await Promise.all(tracks.map( async splitTracks => {
            const res = await api.fetcher.get<{audio_features: Array<AudioFeature>}>
            (`/audio-features/?ids=${splitTracks.map(({ id }) => id).join(",")}`);
            return res.data
        }))
        return trackFeatures
    }))

    res.status(200).json(splitArtistTracks.map((_, i) => {
        const splitTracks = splitArtistTracks[i];
        const splitFeatures = splitArtistTrackFeatures[i];
        return splitTracks.map((_, j) => {
            const tracks = splitTracks[j];
            const features = splitFeatures[j];
            return tracks.map((_, k) => {
                const trackWithFeature: TrackWithFeature = {...tracks[k], ...features.audio_features[k]}
                return trackWithFeature
            })
        }).flat()
    }));
}

export default tracks