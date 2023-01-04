import { Box } from "@mui/material"
import { memo } from "react"

type PropsType = {
    clientID: string, 
    redirectUri: string
}

// eslint-disable-next-line react/display-name
export const LoginButton = memo(({ clientID, redirectUri }: PropsType) => {

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
              borderRadius: 10,
              bgcolor: "white", 
              boxShadow: 5, 
              fontSize: 15, 
              fontWeight: "bold"
             }}
         onClick={login}>
        Sign in with Spotify
        </Box>
    </>
})