import { Button } from "@mui/material"
import { useRef, useState } from "react";


export const useMicrophone = () => {

    const [analyser, setAnalyser] = useState<AnalyserNode>();

    const requestPermission = async () => {
        const audioCtx = new AudioContext();
        const stream = await navigator.mediaDevices.getUserMedia({audio: true});
        const input  = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        input.connect(analyser);
        setAnalyser(analyser);
    }

    const renderRequestButton = () => {
        return <Button onClick={requestPermission} variant="contained">test</Button>
    }

    return { analyser, renderRequestButton }
}