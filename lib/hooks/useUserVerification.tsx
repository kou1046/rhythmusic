import axios from "axios";
import useSWR from "swr";
import { ResponseType } from "../../pages/api/auth/login";

const fetcher = (url: string) => axios.post(url).then(res => res.data);

export const useUserVerification = () => {
    const {data, error, isValidating, mutate} = useSWR<ResponseType>(
        "/api/auth/login", 
        fetcher
    );

    return {data, error, isValidating, mutate}
}