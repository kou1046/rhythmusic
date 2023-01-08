import { useState, memo, Dispatch, SetStateAction, useRef, MutableRefObject, useEffect, useCallback } from "react";
import axios from "axios";
import Box from "@mui/material/Box"
import AddIcon from '@mui/icons-material/Add';
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import SearchArtistModal from "./SearchArtistModal";
import ArtistDeleteModal from "./ArtistDeleteModal";
import { SpotifyArtistAPIResponse, TrackWithFeature } from "../../types/spotifyapi"

type PropsType = {
    artists: Array<SpotifyArtistAPIResponse>,
    setArtists: Dispatch<SetStateAction<Array<SpotifyArtistAPIResponse>>>,
    setArtistTracks: Dispatch<SetStateAction<Array<Array<TrackWithFeature>>>>
}

const VerticalArtistMenu = ({ artists, setArtists, setArtistTracks }: PropsType) => {

    const [ isSearchModalActive, setIsSearchModalActive ] = useState<boolean>(false);
    const [ isDeleteModalActive, setIsDeleteModalActive ] = useState<boolean>(false);
    const torchedArtist = useRef<SpotifyArtistAPIResponse>();

    const fetchHugeTracks = useCallback( async () => {
        if (!artists.length) return 
        const artistIDs = artists.map(({ id }) => id).join(",");
        const res = await axios.get<Array<Array<TrackWithFeature>>>(
            `/api/artists/${artistIDs}/tracks`
        )
        setArtistTracks(res.data);
    }, [artists])

    useEffect(() => {
        if (isSearchModalActive) return 
        else {
            fetchHugeTracks();
        }
    }, [isSearchModalActive]) //アーティスト選択画面を閉じたタイミングで，選択したアーティスト分，まとめて取得する．

    return <>
        <ArtistDeleteModal
          focusArtist={torchedArtist as MutableRefObject<SpotifyArtistAPIResponse>}
          isActiveState={isDeleteModalActive} 
          setArtists={setArtists}
          setArtistTracks={setArtistTracks}
          setIsActiveState={setIsDeleteModalActive}
        />
        <SearchArtistModal 
          artists={artists}
          isActiveState={isSearchModalActive} 
          setArtists={setArtists}
          setIsActiveState={setIsSearchModalActive}
          />
        <Box sx={{
                  height: "100vh", 
                  overflow: "auto",
                  textAlign: "center"
                  }}>
                    
              {artists.map(artist => <Box 
                                       key={artist.name}
                                       sx={{display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center", 
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            borderBottom: "solid 1px lightgray",
                                            ":hover": {
                                               bgcolor: "lightgray"
                                            },
                                           }}
                                        onClick={() => {
                                            torchedArtist.current = artist;
                                            setIsDeleteModalActive(true);
                                        }}>
                                        <ArtistIcon  artist={artist}/>
                                     </Box>) }
            <Zoom in={true}>
              <Fab 
                color={"primary"} 
                sx={{width: 50, height: 50, mt: 1}}
                onClick={() => setIsSearchModalActive(true)}
                >
                  <AddIcon />
              </Fab>
            </Zoom>

            <Typography sx={{fontSize: 10}}>Add artist</Typography>
        </Box>
    </>
}

const ArtistIcon = ({ artist }: {artist: SpotifyArtistAPIResponse}) => {
    return <>
        <Avatar sx={{width: 50, height: 50, mt: 1}} src={artist.images[0].url} alt={artist.name} />
        <Typography sx={{fontSize: 10}}>{artist.name}</Typography>
    </>
}

export default memo(VerticalArtistMenu)



