import useSWR from "swr"
import axios from "axios"

const fetcher = (url: string) => axios.get(url).then(res => res.data);

const useTopArtists = () => {
    const {data, error, isValidating, mutate} = useSWR(
        "/api/artists/user-top",
        fetcher
        );

    return {data, error, isValidating, mutate}
}   