import { useState } from "react";
import Image from "next/image"
import Box from "@mui/material/Box"
import Flicking from "@egjs/react-flicking";
import "@egjs/react-flicking/dist/flicking-inline.css";
import { SpotifyArtistAPIResponse } from "../../types/spotifyapi"
import { Typography } from "@mui/material";

type PropsType = {
    artists: Array<SpotifyArtistAPIResponse>
}

export const ArtistCards = ({ artists }: PropsType) => {

    const [ currentArtistName, setCurrentAritstName ] = useState<string>("");

    const flickEventHandler = (index: number) => {
        const artistName = artists.map(({ name }) => name)[index];
        setCurrentAritstName(artistName);
    }

    return <>
        <Box sx={{width: 200}}>
            <Typography>{currentArtistName}</Typography>
            <Flicking 
              align={"center"}
              onChanged={(e) => flickEventHandler(e.currentTarget.index)}
              onReady={(e) => flickEventHandler(e.currentTarget.index)}
            >
                {artists.map((artist) => (
                                        <Box key={artist.name} sx={{m: "0 1em"}}>
                                            <Image alt={artist.name} src={artist.images[1].url} width={200} height={200} priority={true}/>
                                        </Box>
                                        )
                            )
                }
            </Flicking>
        </Box>
    </> 
}

const ArtistCard = ({ artist }: {artist: SpotifyArtistAPIResponse}) => {
    return <>
        <Box sx={{m: "0 2px"}}>
            <Image alt={artist.name} src={artist.images[1].url} width={200} height={200}></Image>
        </Box>
    </>
}





