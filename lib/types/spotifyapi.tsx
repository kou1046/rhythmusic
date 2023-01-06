export type SpotifyMeAPIResponse = {
    display_name: string, 
    external_urls: ExternalUrls,
    followers: Followers
    href: string, 
    id: string, 
    images: Array<string>, 
    type: string, 
    uri: string
}

export type SpotifyAuthApiResponse = {
    access_token: string,
    token_type: string,
    scope: string,
    expires_in: number,
    refresh_token: string
  }

export type SpotifyAlbumAPIResponse = {
    album_type: string, 
    total_tracks: number, 
    available_markets: Array<string>, 
    external_urls: string, 
    href: string, 
    id: string, 
    images: Images,
    name: string, 
    release_data: string, 
    release_date_precision: string, 
    restrictions: { reason: string },
    type: string, 
    uri: string, 
    artists: Array<SpotifyArtistAPIResponse>
    tracks: SpotifyPluralResponse<SpotifyTrackAPIResponse>
}

type Followers = {
    href: string, 
    total: number
}

type ExternalIds = {
    isrc: string,
    ean: string, 
    upc: string
}

type ExternalUrls = {
    spotify: string
}

export type SpotifyPluralResponse<T> = {
    href: string, 
    items: Array<T>
    limit: number,
    next: string | null, 
    offset: number,
    previous: string | null,
    total: number
}

type Images = Array<{
    url: string, 
    height: number,
    width: number,
}>

type Restriction = {
    reason: string
}

interface SpotifySimpleArtistAPIResponse {
    external_urls: ExternalUrls
    href: string
    id: string
    name: string
    type: string 
    uri: string 
}

export interface SpotifyArtistAPIResponse extends SpotifySimpleArtistAPIResponse {
    followers: Followers; 
    genres: Array<string>;
    images: Images;
    popularity: number;
    type: string;
}

export interface SpotifyTrackAPIResponse {
    artists: Array<SpotifySimpleArtistAPIResponse>;
    avairable_markets: Array<string>;
    disc_number: number;
    diration_ms: number;
    external_urls: ExternalUrls;
    explict: boolean;
    href: string;
    id: string;
    is_playable: boolean;
    pulularity: number;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
    is_local: boolean;
    name: string;
    release_date: string;
    release_date_precision: string;
    restriction: Restriction;
}

export interface MyTrack extends SpotifyTrackAPIResponse {
    albumImages: Images
}

export interface AudioFeature {
    acousticess: number; 
    analysis_url: string; 
    danceability: number; 
    duration_ms: number; 
    energy: number; 
    id: string; 
    instrumentalness: number; 
    key: number; 
    liveness: number; 
    loudness: number; 
    mode: number; 
    speechiness: number; 
    tempo: number; 
    time_signature: number; 
    track_href: string; 
    type: string; 
    uri: string; 
    valence: number;
}

export type TrackWithFeature = MyTrack & AudioFeature;