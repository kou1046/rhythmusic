import { Box } from "@mui/material"
import { Typography } from "@mui/material"
import { memo } from "react"

type PropsType = {
    clientID: string, 
    redirectUri: string
}

// eslint-disable-next-line react/display-name
const LoginButton = memo(({ clientID, redirectUri }: PropsType) => {

    const login = () => {
        const scopes = ["app-remote-control", "user-follow-modify", "user-follow-read", "user-read-playback-state", 
                  "playlist-read-private", "user-top-read"
                 ];
        const params = new URLSearchParams();
        params.append("client_id", clientID || "");
        params.append("response_type", "code");
        params.append('redirect_uri', redirectUri || "");
        params.append('scope', scopes.join(' '));
        params.append('state', 'state');
        window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`
    }

    return <>
        <Box 
         component="button" 
         sx={{p: 2,
              border: "solid 2px white",
              borderRadius: 10,
              boxShadow: 5, 
              fontSize: 15, 
              fontWeight: "bold",
              bgcolor: "#1db954",
              cursor: "pointer",
              ":hover": {
                opacity: 0.7
              }
             }}
         onClick={login}>
        <Typography sx={{color: "black", fontWeight: "bold"}}>Sign in with Spotify</Typography>
        </Box>
    </>
})

export default LoginButton