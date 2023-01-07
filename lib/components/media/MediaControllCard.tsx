import { useEffect, MutableRefObject, useState, memo } from "react";
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import PauseIcon from '@mui/icons-material/Pause';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

type PropsType = {
    track: Spotify.Track,
    playerRef: MutableRefObject<Spotify.Player | undefined> 
}

const MediaControlCard = ({ track, playerRef }: PropsType ) => {

    const [ isPlaying, setIsPlaying] = useState<boolean>(false);

    useEffect(() => {
        if (!track.id) return
        const checkPause = async () => {
            const res = await playerRef.current?.getCurrentState();
            if (res?.paused) setIsPlaying(false);
        }
        setIsPlaying(true);
        checkPause();
    }, [track])

    return (
              <Card sx={{ display: 'flex', justifyContent: "center"}}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: "30vmax", overflow: "hidden", textOverflow: "ellipsis"}}>
                  <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h5" sx={{fontWeight: "bold"}}>
                      {track.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                      {track.artists[0].name}
                    </Typography>
                  </CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1, justifyContent: "center",}}>
                    <IconButton aria-label="previous"
                                onClick={() => playerRef.current?.previousTrack()}>
                        <SkipPreviousIcon />
                    </IconButton>
                    <IconButton aria-label="play/pause" 
                                onClick={() => playerRef.current?.togglePlay()}>
                      { isPlaying ? <PauseIcon sx={{ height: 38, width: 38 }}/> : <PlayArrowIcon sx={{ height: 38, width: 38 }} /> }
                    </IconButton>
                    <IconButton aria-label="next"
                                onClick={() => playerRef.current?.nextTrack()}>
                      <SkipNextIcon />
                    </IconButton>
                  </Box>
                </Box>
                <CardMedia
                  component="img"
                  sx={{ width: "20vmax"}}
                  image={track.album.images[2].url}
                  alt={track.name}
                />
              </Card>
            );
}

export default memo(MediaControlCard)