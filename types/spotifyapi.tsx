export type SpotifyMeApiResponse = {
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