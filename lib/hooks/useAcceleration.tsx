import { useCallback, useRef, useState } from "react"
import { Button } from "@mui/material";

type Acceleration = {
    x: number | null, 
    y: number | null, 
    z: number | null,
}

export const useAcceleration = () => {

    const [accs, setAccs] = useState<Acceleration>();
    const [status, setStatus] = useState<"default" | "denied" | "granted">("default");

    const requestPermission = () => {
        if (navigator.userAgent.match('iPhone|iPad')) {
            (window.DeviceMotionEvent as any).requestPermission().then((res: string) => {
                if (res != 'granted') {
                    alert('ブラウザを再起動してセンサー利用の許可をして下さい！');
                    setStatus("denied");
                    return
                }
              }
            )
        }

        window.addEventListener('devicemotion', (e: DeviceMotionEvent) => {
            if (e.acceleration) {
                const {x, y, z} = e.acceleration; 

                setAccs((prevAccs) => { 
                    //初回のみオブジェクトの書き換え　以降は中身の書き換えのみを行い，オブジェクト自体は更新しない（再レンダリングしない）
                    if (!prevAccs) return {x, y, z}
                    prevAccs.x = x; 
                    prevAccs.y = y;
                    prevAccs.z = z;
                    return prevAccs
                })
            }
        })

        setStatus("granted");
    }

    const renderRequestButton = useCallback(() => {
        return <Button 
                variant="outlined" 
                color="error" 
                onClick={requestPermission}
                >Enable censor</Button>
    }, [])

    return {accs, status, renderRequestButton}
}