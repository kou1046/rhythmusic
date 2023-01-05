import { useState, useEffect, useRef, useCallback } from "react";
import { GetServerSideProps } from "next";

import { parseCookies, setCookie } from "nookies";
import axios from "axios";
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography";
import Mic from "@mui/icons-material/Mic";
import Fab from "@mui/material/Fab"
import Zoom from "@mui/material/Zoom";
import Grid from "@mui/material/Grid"
import MicOff from "@mui/icons-material/MicOff"
import TouchAppIcon from '@mui/icons-material/TouchApp';
import VibrationIcon from '@mui/icons-material/Vibration';
import MobileOffIcon from '@mui/icons-material/MobileOff';
import Chart from "chart.js/auto"

import { SpotifyArtistAPIResponse, SpotifyAuthApiResponse, SpotifyMeAPIResponse, TrackWithFeature } from "../lib/types/spotifyapi";
import { selectTracksByBpm, spotifyAPI } from "../lib/utils";
import VerticalArtistMenu from "../lib/components/media/VerticalArtistMenu";
import TrackCard from "../lib/components/media/TrackCard";
import Ballon from "../lib/components/container/Ballon";
import useMeasurementBpmWithChart from "../lib/hooks/useMeasurementBpmWithChart";
import useMicrophone from "../lib/hooks/useMicrophone";
import AudioChart from "../lib/components/chart/AudioChart";
import useAcceleration from "../lib/hooks/useAcceleration";
import AccelerationChart from "../lib/components/chart/AccelerationChart";
import LogoutButton from "../lib/components/auth/LogoutButton";

export default function App ({ loginData }: PageProps) {

    const [ artists, setArtists ] = useState<Array<SpotifyArtistAPIResponse>>([]);
    const [ artistTracks, setArtistTracks ] = useState<Array<Array<TrackWithFeature>>>([]);
    const { analyser, requestPermission: microphoneRequest } = useMicrophone();
    const { accs, requestPermission: motionRequest } = useAcceleration();
    const audioChartRef = useRef<Chart<"line">>(null);
    const accsChartRef = useRef<Chart<"line">>(null);
    const { bpms, setBpms, setChart, measureBpm } = useMeasurementBpmWithChart();

    const renderTrackCards = () => {
        if (!artistTracks.length) return <Typography sx={{color: "lightgray"}}>Please select an artist.</Typography>
        if (!bpms.length) return <Typography sx={{color: "lightgray"}}>Let's Tap the rhythm input.</Typography>

        const bpmsAve = bpms.reduce((prev, cur) => prev + cur) / bpms.length;
        const selectedTracks = artistTracks.map(tracks => {
            return selectTracksByBpm(tracks, bpmsAve, 5).flat()
        }).flat()

        if (!selectedTracks.length) return <Typography sx={{color: "lightgray"}}>No song found ...</Typography>

        return <>
            {selectedTracks.map((track, i) => <TrackCard key={`${track.id}-${i}`} track={track}></TrackCard>)}
        </>
    }

    useEffect(() => {
        const fetchArtistTracks = async () => {
            const artistRes = await axios.get<Array<SpotifyArtistAPIResponse>>
            ("/api/artists/user-top");
            if (!artistRes.data.length) return 

            const trackRes = await axios.get<Array<Array<TrackWithFeature>>>(
                `/api/artists/${artistRes.data.map(({ id }) => id).join(",")}/tracks`
            )
            setArtists(artistRes.data);
            setArtistTracks(trackRes.data);
        }
        fetchArtistTracks();
    }, [])

    useEffect(() => {
        setChart(accsChartRef.current || audioChartRef.current);
    }, [analyser, accs])

    return <>
    <Grid container justifyContent={"center"}>
        <Grid item xs={10} sx={{height: "100vh", overflow: "auto", p: 1, pt: 0, border: "solid whitesmoke 1px", position: "relative"}}>
            <Typography sx={{fontWeight: "bold", position: "sticky", top: 0, bgcolor: "white"}}>Tracks</Typography>
            {renderTrackCards()}    
        </Grid>
        <Grid item xs={2}>
            <VerticalArtistMenu artists={artists} />
        </Grid>
        <Grid container sx={{position: "sticky", bottom: "1px", justifyContent: "center"}}>
          <Grid item xs={7} sx={{textAlign: "center"}}>
            <Ballon>
              <Typography sx={{fontWeight: "bold",
                          }}
                            color={"error"}>
                BPM: {bpms.length ? Math.round(bpms.reduce((prev, cur) => prev + cur) / bpms.length) : null}
             </Typography>
              <AudioChart analyser={analyser} chartRef={audioChartRef} />
              <AccelerationChart accs={accs} chartRef={accsChartRef} />
            </Ballon>
          </Grid>
          <Grid item xs={12} sx={{textAlign: "center"}}>
            <Zoom in={!analyser}>
              <Fab  
               sx={{width: 60, height: 60}} 
               color="success"
               onClick={motionRequest}
               >{ accs ? <MobileOffIcon /> : <VibrationIcon /> }</Fab>
            </Zoom>
            <Zoom in={!accs}>
              <Fab 
               sx={{width: 60, height: 60, m:"0 2em"}} 
               color="error"
               onClick={microphoneRequest}
               >{ analyser ? <MicOff /> : <Mic /> }</Fab>
            </Zoom>
            <Zoom in={!analyser && !accs}>
              <Fab 
               sx={{width: 60, height: 60}} 
               color="primary"
               onClick={measureBpm}
              ><TouchAppIcon /></Fab>
            </Zoom>
          </Grid>
        </Grid>
        <Box sx={{mt: 3, textAlign: "center"}}>
          <Typography sx={{fontWeight: "bold"}}>Login with {loginData.me?.display_name}</Typography>
          <LogoutButton />
        </Box>
    </Grid>
    </>
}

type PageProps = {
    loginData: {
        accessToken?: string
        me?: SpotifyMeAPIResponse,
        message? :string
    }
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
    const { res, req } = context;
    const { user } = parseCookies(res);

    if (user) {
        const userObj = JSON.parse(user) as SpotifyAuthApiResponse;
        const accessToken = userObj.access_token;
        const refreshToken = userObj.refresh_token;
        let api = new spotifyAPI(accessToken);
        let me: SpotifyMeAPIResponse | undefined = undefined;
        try {
            const meRes = await api.fetcher.get<SpotifyMeAPIResponse>("/me");
            me = meRes.data;
        } 
        catch { // token期限切れ
            if (refreshToken) { 
                const response = await axios.post<SpotifyAuthApiResponse>(
                    "https://accounts.spotify.com/api/token", 
                    {
                        "refresh_token": refreshToken, 
                        "grant_type": "refresh_token"
                    }, 
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded", 
                            "Authorization": `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`, 'utf-8').toString("base64")}`
                        }
                    }
                )
                
                api = new spotifyAPI(response.data.access_token);
                const meRes = await api.fetcher.get<SpotifyMeAPIResponse>("/me");
                me = meRes.data;
                setCookie({ res }, "user", JSON.stringify(response.data), {
                    httpOnly: true, 
                    path: "/"
                });

                return { props: {
                    loginData: {
                        accessToken: response.data.access_token, me
                    }
                }}
            }
            else {
                return {redirect: { permanent: false, destination: "/"}}
            };

        }
        return { props: { loginData: { accessToken, me }}}
    } else {
        return { redirect: { permanent: false, destination: "/" }}
    } 
}