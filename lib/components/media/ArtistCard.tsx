import Image from "next/image"
import Box from "@mui/material/Box"
import "@egjs/react-flicking/dist/flicking-inline.css";
import { SpotifyArtistAPIResponse } from "../../types/spotifyapi"
import { Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Add from "@mui/icons-material/Add";
import { Dispatch, memo, SetStateAction } from "react";

type PropsType = {
  artist: SpotifyArtistAPIResponse, 
  setArtists: Dispatch<SetStateAction<Array<SpotifyArtistAPIResponse>>>
}

const ArtistCard = ({ artist, setArtists }: PropsType) => {
   
   if (!artist.images[0]) return <></>
    return <>
        <Box sx={{display: "flex", alignItems: "center", borderBottom: "solid whitesmoke 1px", bgcolor: "whitesmoke"}}>
          <Image src={artist.images[0].url} alt={artist.name} width={80} height={80} ></Image>
          <Box sx={{ml: 2, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden"}}>
            <Typography sx={{fontWeight: "bold", mb: 1, }}>{artist.name}</Typography>
            <Typography variant="body2" color={"textSecondary"}>Popularity: {artist.popularity}</Typography>
            <Box sx={{display: "flex"}}>
            </Box>
          </Box>
          <Box sx={{ml: "auto", mr: 1}}>
            <IconButton onClick={() => setArtists(prev => [...prev, artist])}>
              <Add sx={{width: 30, height: 30}} />
            </IconButton>
          </Box>
        </Box>
    </>
}

export default memo(ArtistCard)





