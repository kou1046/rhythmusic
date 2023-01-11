import { ReactNode } from "react";
import Box from "@mui/material/Box";

const MoveToSpotifyButton = ({
  url,
  children,
}: {
  url: string;
  children: ReactNode;
}) => {
  return (
    <>
      <Box
        component="button"
        sx={{
          backdropFilter: "blur(10px)",
          borderRadius: "30px",
          bgcolor: "lightgray",
          border: 0,
          color: "black",
          p: "5px 8px",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          ":hover": {
            opacity: 0.5,
          },
        }}
        onClick={() => window.open(url)}
      >
        <Box
          component="img"
          sx={{ width: 21, height: 21, mr: 0.5 }}
          src="spotify_icon_black.png"
        />
        {children}
      </Box>
    </>
  );
};

export default MoveToSpotifyButton;
