import axios, { AxiosInstance } from "axios";
import { TrackWithFeature } from "./types/spotifyapi";

export class spotifyAPI {
    fetcher: AxiosInstance
    constructor(accessToken: string) {
        this.fetcher = axios.create({
            baseURL: "https://api.spotify.com/v1", 
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }
}

export const splitArray = <T>(array: Array<T>, elementLength: number): Array<Array<T>> => {
    const length = Math.ceil(array.length / elementLength);
    return Array.from( { length } , (_, i) => array.slice(i * elementLength, (i + 1) * elementLength))
}

export const selectTracksByBpm = (tracks: Array<TrackWithFeature>, bpm: number, interval: number = 5): Array<TrackWithFeature> => {
    const selectedTracks = tracks.filter(track => track.tempo <= bpm + interval && track.tempo >= bpm - interval);
    const idxesSortedBySquaredError = selectedTracks.map((track, i) => ({diff: Math.pow(bpm - track.tempo, 2), index: i}))
                                                    .sort((a, b) => (a.diff > b.diff) ? 1 : -1)

    return idxesSortedBySquaredError.map(({ index }) => selectedTracks[index])
}

export const dft = (data: Array<number>) => {
    const N = data.length;
    let Re: Array<number> = [];
    let Im: Array<number> = [];

    [...Array(N)].forEach((_, t) => {
        const reSum = data.map((fx, x) => fx * Math.cos(2 * Math.PI * t * x / N)).reduce((prev, cur) => prev + cur);
        const imSum = data.map((fx, x) => -fx * Math.sin(2 * Math.PI * t * x / N)).reduce((prev, cur) => prev + cur);
        Re = [...Re, reSum];
        Im = [...Im, imSum];
    })
    return {
        Re: Re,
        Im: Im
    }
}

export const idft = (data: Array<number>) => {
    const N = data.length;
    let Re: Array<number> = [];
    let Im: Array<number> = [];
    [...Array(N)].forEach((_, time) => {
        const Re_sum = data.map((fx, x) => fx * Math.cos(2 * Math.PI * time * x / N)).reduce((prev, cur) => prev + cur);
        const Im_sum = data.map((fx, x) => fx * Math.sin(2 * Math.PI * time * x / N)).reduce((prev, cur) => prev + cur);
        Re = [...Re, Re_sum];
        Im = [...Im, Im_sum];
    })
    return { Re: Re.map(el => el / N), Im: Im.map(el => el / N) }
}
