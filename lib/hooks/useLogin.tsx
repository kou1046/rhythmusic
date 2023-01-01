import axios from "axios";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { SpotifyAuthApiResponse } from "../../pages/api/auth";
import { ResponseType } from "../../pages/api/checkLogin";

const fetcher = (url: string) => axios.post(url).then(res => res.data);

export const useLogin = () => {
    const {data, error, isValidating, mutate} = useSWR<ResponseType>(
        "/api/checkLogin", 
        fetcher
    );

    return {data, error, isValidating, mutate}
}