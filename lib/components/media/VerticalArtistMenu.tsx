import { useState } from "react";
import Image from "next/image"
import Box from "@mui/material/Box"
import Flicking from "@egjs/react-flicking";
import "@egjs/react-flicking/dist/flicking-inline.css";
import { SpotifyArtistAPIResponse } from "../../types/spotifyapi"
import Avatar from "@mui/material/Avatar"
import Typography from "@mui/material/Typography";

type PropsType = {
    artists: Array<SpotifyArtistAPIResponse>
}

const VerticalArtistMenu = ({ artists }: PropsType) => {

    const [ currentArtistName, setCurrentAritstName ] = useState<string>("");

    const flickEventHandler = (index: number) => {
        const artistName = artists.map(({ name }) => name)[index];
        setCurrentAritstName(artistName);
    }

    return <>
        <Box sx={{
                  height: "100vh", 
                  overflow: "auto",
                  }}>
                    
              {artists.map(artist => <Box key={artist.name} sx={{display: "flex",
                                                                 flexDirection: "column",
                                                                 alignItems: "center", 
                                                                 mb: 1,
                                                                 borderBottom: "solid 1px lightgray"
                                                                 }}>
                                        <ArtistIcon  artist={artist}/>
                                     </Box>) }
        </Box>
    </>
}

const ArtistIcon = ({ artist }: {artist: SpotifyArtistAPIResponse}) => {
    return <>
        <Avatar sx={{width: 50, height: 50}} src={artist.images[0].url} alt={artist.name} />
        <Typography sx={{fontSize: 10}}>{artist.name}</Typography>
    </>
}

export default VerticalArtistMenu



