import { useCallback, useEffect } from "react";
import axios from "axios";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import Box from "@mui/material/Box";
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import AppBar from "@mui/material/AppBar";
import Input from "@mui/material/Input"
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { SpotifyArtistAPIResponse } from "../../types/spotifyapi";
import ArtistCard from "./ArtistCard";

type PropsType = {
    artists: Array<SpotifyArtistAPIResponse>,
    isActiveState: boolean
    setArtists: Dispatch<SetStateAction<Array<SpotifyArtistAPIResponse>>>
    setIsActiveState: Dispatch<SetStateAction<boolean>>
}

const SearchArtistModal = ({ artists, isActiveState, setArtists, setIsActiveState }: PropsType) => {

    const inputRef = useRef<HTMLInputElement>(null);
    const [ resultArtists, setResultArtists ] = useState<Array<SpotifyArtistAPIResponse>>([]);

    const getOmittedArtists = useCallback((newArtists: Array<SpotifyArtistAPIResponse>) => {
        const artistNames = new Set(artists.map(({ name }) => name));
        return newArtists.filter(({ name }) => !artistNames.has(name))
    }, [artists])

    useEffect(() => setResultArtists(prev => getOmittedArtists(prev)), [artists]);
    useEffect(() => {
       if (!isActiveState) setResultArtists([]);
       else {
            const fetchUserTopArtists = async () => {
                const res = await axios.get<Array<SpotifyArtistAPIResponse>>("/api/artists/user-top", {
                    params: {
                        limit: 30
                    }
                });
                setResultArtists(getOmittedArtists(res.data));
            }
        fetchUserTopArtists();
        }
    }, [isActiveState]);

    return <>
    <Modal
     open={isActiveState}
     onClose={() => setIsActiveState(false)}
    >
      <Box sx={{
             position: 'absolute',
             top: '50%',
             left: '50%',
             transform: 'translate(-50%, -50%)',
             width: "80%",
             height: "60%",
             bgcolor: 'background.paper',
             border: '2px solid #000',
             boxShadow: 24,
             p: 1,
             overflow: "auto",
             }}>
        <AppBar sx={{position: "static", bgcolor: "dimgray"}}>
          <Box sx={{position: "relative"}}>
            <IconButton>
              <SearchIcon />
            </IconButton>
            <Input 
              sx={{width: "70%"}}
              placeholder="Search artist…" 
              inputRef={inputRef}
              onKeyDown={ async (e) => {
                if (e.key === "Enter"){
                  if (!inputRef.current!.value) return 
                    const res = await axios.get<Array<SpotifyArtistAPIResponse>>
                    (`/api/artistSearch/?q=${inputRef.current!.value}`)
                    setResultArtists(getOmittedArtists(res.data));
                }
              }}/>
          </Box>
        </AppBar>
        <Box sx={{overflow: "hidden", mt: 1, border: "solid 1px whitesmoke"}}>
          { resultArtists.length 
            ? 
              resultArtists.map((artist, i) => <ArtistCard key={`${artist.name}-${i}`} artist={artist} setArtists={setArtists}/>)
            : null }
        </Box>
      </Box>
    </Modal>
    </>
}

export default SearchArtistModal