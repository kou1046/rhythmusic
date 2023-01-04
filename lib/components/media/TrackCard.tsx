import Image from "next/image"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { SpotifyArtistAPIResponse, TrackWithFeature } from "../../types/spotifyapi"
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

type PropsType = {
    artist: SpotifyArtistAPIResponse
    track: TrackWithFeature
}

const TrackCard = ({ artist, track }: PropsType) => {
    return <>
        <Box sx={{display: "flex", alignItems: "center"}}>
          <Image src={artist.images[0].url} alt={track.name} width={100} height={100}></Image>
          <Box sx={{ml: 2}}>
            <Typography sx={{fontWeight: "bold", mb: 1}}>{track.name}</Typography>
            <Typography variant="body2" color={"textSecondary"}>{artist.name}</Typography>
            <Box sx={{display: "flex"}}>
              <Typography color={"textSecondary"} variant="body2">BPM: {track.tempo}</Typography>              
            </Box>
          </Box>
          <PlayCircleIcon sx={{ml: "auto"}}/>
        </Box>
    </>
}

export default TrackCard