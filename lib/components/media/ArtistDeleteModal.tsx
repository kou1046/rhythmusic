import { MutableRefObject, Dispatch, SetStateAction } from "react"
import Fab from "@mui/material/Fab"
import Modal from "@mui/material/Modal"
import Box from "@mui/material/Box"
import CloseIcon from '@mui/icons-material/Close';
import Typography from "@mui/material/Typography"
import { SpotifyArtistAPIResponse, TrackWithFeature } from "../../types/spotifyapi"

type PropsType = {
    focusArtist: MutableRefObject<SpotifyArtistAPIResponse>,
    isActiveState: boolean
    setArtists: Dispatch<SetStateAction<Array<SpotifyArtistAPIResponse>>>,
    setArtistTracks: Dispatch<SetStateAction<Array<Array<TrackWithFeature>>>>,
    setIsActiveState: Dispatch<SetStateAction<boolean>>
}

const ArtistDeleteModal = ({ focusArtist, setArtists, setArtistTracks, isActiveState, setIsActiveState }: PropsType) => {
    if (!isActiveState) return <></>
    return <>
        <Modal 
          open={isActiveState}
          onClose={() => setIsActiveState(false)}>
          <Box sx={{
             position: 'absolute',
             top: '45%',
             left: '50%',
             transform: 'translate(-50%, -50%)',
             width: "30vmax",
             height: "30vmax",
             bgcolor: 'background.paper',
             border: '2px solid #000',
             boxShadow: 24,
             }}>
            <img
              width={"100%"}
              height={"100%"}
              src={focusArtist.current.images[0].url}
              alt={focusArtist.current.name}
              />
            <Box sx={{textAlign: "center", color: "white"}}>
              <Typography sx={{fontWeight: "bold", fontSize: 20}}>{focusArtist.current.name}</Typography>
              <Fab 
                color={"error"}
                onClick={() => {
                    setArtists(prev => prev.filter(({ name }, i) => { //setArtists関数内で，消去するアーティストのトラックも消去
                      if (name === focusArtist.current.name) setArtistTracks(prev => prev.filter((_, j) => (i !== j)))
                      return (name !== focusArtist.current.name)
                    }));
                    setIsActiveState(false);
                }}
                >
                <CloseIcon />
              </Fab>
            </Box>
          </Box>
        </Modal>
    </>
}

export default ArtistDeleteModal