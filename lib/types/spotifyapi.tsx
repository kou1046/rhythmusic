export type SpotifyMeAPIResponse = {
    diplay_name: string, 
    external_urls: {
        spotify: string
    }, 
    followers: {
        href: null | string, 
        total: number,
    }, 
    href: string, 
    id: string, 
    images: Array<string>, 
    type: string, 
    uri: string
}

export type SpotifyAlbumAPIResponse = {
    album_type: string, 
    total_trakcs: number, 
    available_markets: Array<string>, 
    external_urls: string, 
    href: string, 
    id: string, 
    images: Array<{
        url: string, 
        height: number, 
        width: number
    }>,
    name: string, 
    release_data: string, 
    release_date_precision: string, 
    restrictions: { reason: string },
    type: string, 
    uri: string, 
    artists: Array<{
        external_urls: {
            spotify: string
        }, 
        followers: {
            href: string, 
            total: number,
        }, 
        genres: Array<string>, 
        href: string, 
        id: string, 
        images: Array<{
            url: string, 
            height: number, 
            width: number, 
        }>, 
        name: string, 
        popularity: number, 
        type: string, 
        uri: string, 
    }>,
    tracks: {
        href: string, 
        items: Array<any>, 
        limit: number, 
        next: string, 
        offset: number, 
        previous: string, 
        total: number
    }
}

export type SpotifyArtistAlbumsAPIResponse = {
    href: string, 
    items: Array<any>, 
    limit: number,
    next: string | null
    offset: number, 
    previoues: string | null 
    total: number
}

export type AudioFeature = {
    acousticess: number, 
    analysis_url: string, 
    danceability: number, 
    duration_ms: number, 
    energy: number, 
    id: string, 
    instrumentalness: number, 
    key: number, 
    liveness: number, 
    loudness: number, 
    mode: number, 
    speechiness: number, 
    tempo: number, 
    time_signature: number, 
    track_href: string, 
    type: string, 
    uri: string, 
    valence: number,
}