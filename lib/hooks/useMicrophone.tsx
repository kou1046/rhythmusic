import { Button } from "@mui/material"
import { useState } from "react";
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import TouchAppIcon from '@mui/icons-material/TouchApp';

export const useMicrophone = () => {

    const [analyser, setAnalyser] = useState<AnalyserNode>();
    const [isGranted, setIsGranted] = useState<boolean>();

    const requestPermission = async () => {
        if (!analyser){
            const audioCtx = new AudioContext();
            const stream = await navigator.mediaDevices.getUserMedia({audio: true}).catch((e) => {
                return null
            });
            if (!stream) {
                setIsGranted(false);
                return
            }

            const input  = audioCtx.createMediaStreamSource(stream);
            const analyser = audioCtx.createAnalyser(); 
            input.connect(analyser);
            setAnalyser(analyser);
            setIsGranted(true);
        }
        else {
            setAnalyser(undefined);
        }
    }

    const renderRequestButton = () => {
        return <Button onClick={requestPermission} variant="contained" color="error">
                {analyser ? <MicOffIcon />: <MicIcon />}
               </Button>
    }

    return { analyser, renderRequestButton, isGranted}
}