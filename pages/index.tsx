import { useRef, useState, useEffect } from 'react';
import { GetStaticProps } from 'next'
import axios from 'axios';
import { Box } from '@mui/system';
import Fab from '@mui/material/Fab';
import Typography from '@mui/material/Typography';
import { CircularProgress, Grid } from '@mui/material';
import Chart from "chart.js/auto"
import StreamingPlugin from 'chartjs-plugin-streaming';
import "chartjs-adapter-moment"
import { useUserVerification } from '../lib/hooks/useUserVerification';
import { useMeasurementBpmWithSensor } from '../lib/hooks/useMeasurementBpmWithSensor';
import { LoginButton } from '../lib/components/auth/LoginButton';
import { LogoutButton } from '../lib/components/auth/LogoutButton';
import { AudioAmplitudeChart } from '../lib/components/chart/AudioAmplitudeChart';
import { AccelerationChart } from '../lib/components/chart/AccelerationChart';
import { SpotifyArtistAPIResponse, TrackWithFeature } from '../lib/types/spotifyapi';
import { ArtistCards } from '../lib/components/media/ArtistCards';
import TrackCard from '../lib/components/media/TrackCard';
import { selectTracksByBpm } from '../lib/utils';
               
Chart.register(StreamingPlugin) ;

export const getStaticProps: GetStaticProps<pageProps> = async () => {
  return { props : {
    clientID: process.env.CLIENT_ID as string, 
    clientSecret: process.env.CLIENT_SECRET as string,
    redirectUri: process.env.REDIRECT_URI as string
  }}
}

type pageProps = {
  clientID: string,
  clientSecret: string, 
  redirectUri: string
}

export default function Home(pageprops: pageProps) {

  const chartRef = useRef<Chart<"line">>(null);
  const { bpms, setBpms, measureBpm } = useMeasurementBpmWithSensor(chartRef);
  const { data: loginData, error: loginError, mutate: loginMutate } = useUserVerification();
  const [ artists, setArtists ] = useState<Array<SpotifyArtistAPIResponse>>([]);
  const [ artistTracks, setArtistTracks ] = useState<Array<Array<TrackWithFeature>>>([]);
  const size = {
    minWidth: 300, 
    maxWidth: 800
  }

  useEffect(() => {
    if (!loginData?.me) {
      setArtists([]);
      return
    }
    const fetchArtists = async () => {
      const res = await axios.get<Array<SpotifyArtistAPIResponse>>("/api/artists/user-top");
      setArtists(res.data);
    };
    fetchArtists();
  }, [loginData])

  useEffect(() => {
    if (bpms.length != 5) return 
      const fetchTracks = async () => {
        const res = await axios.get<Array<Array<TrackWithFeature>>>(
          `/api/artists/${artists.map(({ id }) => id).join(",")}/tracks`
          );
        console.log(res.data);
        setArtistTracks(res.data);
      } 
      fetchTracks();
  }, [bpms])

  return (
    <Box sx={{minHeight: "100vh"}}>
      <Grid container direction={"column"} alignItems="center" spacing={3}>
        <Grid item>
          <Box sx={{display: "flex", flexDirection: "column"}}>
            <Typography>{loginData?.accessToken ? `Logging in with ${loginData.me?.display_name}`: null}</Typography>
            {loginData?.me ? <LogoutButton loginMutate={ loginMutate }/>: <LoginButton { ...pageprops }></LoginButton>}
          </Box>
        </Grid>
        { loginData?.me ? 
          <Grid item>
          { artists.length ? 
            <Box sx={{border: "dashed 1.5px", p: 2}}>
              <ArtistCards artists={artists} />
              <Box sx={{textAlign: "center"}}>
                <Typography>Selected artists</Typography>
              </Box>
            </Box>
            :
            <CircularProgress />
          }
          </Grid>
          :
          null
        }
        <Grid item>
          {loginData?.me ? 
          <Box sx={{...size, textAlign: "center", boxShadow: "0 0 8px gray", borderRadius: 3, p: 3}}>
            <Typography sx={{fontWeight: "bold"}}>BPM: {bpms.length ? bpms.reduce((prev, cur) => (prev + cur)) / bpms.length : 0}</Typography>
            <AudioAmplitudeChart chartRef={chartRef} threshold={200}/>
          </Box> 
          : null
         }
         </Grid>
         <Grid item>
          {artistTracks.length ? 
            selectTracksByBpm(artistTracks[5], bpms.reduce((prev, cur) => prev + cur) / bpms.length)
            .map(track => <TrackCard track={track} artist={artists[5]} key={track.name} />)
           :
            null
          }
         </Grid>
    </Grid>
      <Box sx={{position: "sticky", bottom: 0, display: "flex", flexDirection: "row-reverse"}}>
        <Fab></Fab>
        <Fab></Fab>
        <Fab></Fab>
      </Box>
    </Box>
  )
}