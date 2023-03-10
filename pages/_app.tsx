import Link from 'next/link';
import type { AppProps } from 'next/app'
import GitHubIcon from '@mui/icons-material/GitHub';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';

export default function App({ Component, pageProps }: AppProps) {

  return<>
    <Box component={"header"} sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    p: 1,
                                    fontSize: 24,
                                    bgcolor: "whitesmoke"
                                    }}>
      <Typography variant={"h5"} sx={{fontWeight: "bold", fontSize: 20}}>RHYTHMUSIC</Typography>
      <Link href={"https://github.com/kou1046/walk-music"}>
        <IconButton>
          <GitHubIcon />
        </IconButton>
      </Link>
    </Box>
      <Component {...pageProps} />
    
  </>
}
