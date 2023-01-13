import { Box } from "@mui/material";
import { Typography } from "@mui/material";
import { memo } from "react";

type PropsType = {
  clientID: string;
  redirectUri: string;
};

// eslint-disable-next-line react/display-name
const LoginButton = memo(({ clientID, redirectUri }: PropsType) => {
  const login = () => {
    const scopes = [
      "user-read-playback-state",
      "user-read-email",
      "user-top-read",
      "user-read-currently-playing",
      "streaming",
      "user-modify-playback-state",
      "playlist-modify-public",
    ];
    const params = new URLSearchParams();
    params.append("client_id", clientID || "");
    params.append("response_type", "code");
    params.append("redirect_uri", redirectUri || "");
    params.append("scope", scopes.join(" "));
    params.append("state", "state");
    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  };

  return (
    <>
      <Box
        component="button"
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          border: "solid 2px black",
          borderRadius: 10,
          boxShadow: 5,
          fontSize: 15,
          fontWeight: "bold",
          bgcolor: "white",
          cursor: "pointer",
          ":hover": {
            opacity: 0.7,
            transform: "scale(1.05)",
          },
        }}
        onClick={login}
      >
        <img src="/spotify_icon.png" width={25} height={25}></img>
        <Typography sx={{ color: "black", fontWeight: "bold", ml: 1 }}>
          Sign in with Spotify
        </Typography>
      </Box>
    </>
  );
});

export default LoginButton;
