import axios, { AxiosInstance } from "axios";

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
