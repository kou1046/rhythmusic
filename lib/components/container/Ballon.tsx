import { ReactNode } from 'react';
import { Box } from "@mui/system";
import { SxProps, Theme } from '@mui/material/styles'

type PropsType = {
    children?: ReactNode, 
    sx?: SxProps<Theme>
}

const Ballon = ({ children, sx }: PropsType) => {

    return <>
        <Box sx={{
            maxHeight: 100,
            position: "relative",
            m: "5px auto",
            p: "5px 5px",
            minWidth: "120px;",
            maxWidth: 300,
            color: "*555",
            boxSizing: "border-box",
            border: "solid 3px #555",
            background: "#FFF",
            borderRadius: 2,
        }}>
            { children }
        </Box>
    </>
}

export default Ballon