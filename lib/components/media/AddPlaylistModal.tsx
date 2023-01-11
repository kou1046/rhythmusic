import {
  Dispatch,
  SetStateAction,
  memo,
  useState,
  useCallback,
  useRef,
} from "react";
import Box from "@mui/material/Box";
import ClearIcon from "@mui/icons-material/Clear";
import Alert from "@mui/material/Alert";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import CircleProgress from "@mui/material/CircularProgress";
import Input from "@mui/material/Input";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { TrackWithFeature } from "../../types/spotifyapi";
import TrackCard from "./TrackCard";
import axios from "axios";

type Props = {
  isActiveState: boolean;
  setIsActiveState: Dispatch<SetStateAction<boolean>>;
  tracks: Array<TrackWithFeature>;
  bpm: number;
  userID: string;
};

const AddPlaylistModal = ({
  isActiveState,
  setIsActiveState,
  tracks,
  bpm,
  userID,
}: Props) => {
  const [playlistTracks, setPlaylistTracks] =
    useState<Array<TrackWithFeature>>(tracks);
  const [isEnabledSnackBar, setIsEnabledSnackBar] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const getDefaultPlaylistName = useCallback(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day} BPM ${bpm} Playlist`;
  }, [bpm]);

  return (
    <>
      <Snackbar
        open={isEnabledSnackBar}
        autoHideDuration={2000}
        onClose={() => setIsEnabledSnackBar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setIsEnabledSnackBar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          The playlist was successfully added!
        </Alert>
      </Snackbar>
      <Modal open={isActiveState} onClose={() => setIsActiveState(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            height: "60%",
          }}
        >
          <Box
            sx={{
              height: "10%",
              border: "solid",
              position: "relative",
              bgcolor: "white",
              p: 1,
              borderRadius: 3,
            }}
          >
            <Input
              inputRef={inputRef}
              sx={{
                width: "80%",
                height: "80%",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontWeight: "bold",
              }}
              placeholder={"Playlist name..."}
              defaultValue={getDefaultPlaylistName()}
            />
          </Box>
          <Box
            sx={{
              height: "80%",
              overflow: "auto",
              mt: 1,
              border: "solid white 2px",
            }}
          >
            {playlistTracks.map((track, i) => (
              <Grid
                container
                key={`playlist-${i}-${track.id}`}
                sx={{ pt: 0.1 }}
              >
                <Grid item xs={10}>
                  <TrackCard track={track} />
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{
                    position: "relative",
                    bgcolor: "lightgray",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setPlaylistTracks((prev) => prev.filter((_, j) => i !== j))
                  }
                >
                  <ClearIcon
                    sx={{
                      top: "50%",
                      left: "50%",
                      position: "absolute",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                </Grid>
              </Grid>
            ))}
          </Box>
          <Box sx={{ height: "10%", textAlign: "center", mt: 1 }}>
            {isCreating ? (
              <CircleProgress />
            ) : (
              <Button
                variant="contained"
                sx={{ border: "solid 2px white" }}
                onClick={async (e) => {
                  setIsCreating(true);
                  try {
                    await axios.post(`/api/playlists/create`, {
                      userID,
                      name: inputRef.current!.value
                        ? inputRef.current!.value
                        : getDefaultPlaylistName(),
                      uris: playlistTracks.map(({ uri }) => uri),
                    });
                    setIsEnabledSnackBar(true);
                  } catch {
                    alert(
                      "sorry. For some reason, the playlist could not be added."
                    );
                  } finally {
                    setIsActiveState(false);
                    setIsCreating(false);
                  }
                }}
              >
                <PlaylistAddIcon />
                Add playlist
                <Box
                  component={"img"}
                  src="spotify_icon_black.png"
                  sx={{ ml: 1 }}
                  width={21}
                  height={21}
                />
              </Button>
            )}
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default memo(AddPlaylistModal);
