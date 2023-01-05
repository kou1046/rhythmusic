import { Box, Typography } from "@mui/material"
import axios from "axios"
import { KeyedMutator } from "swr/_internal"

const LogoutButton = () => {

    const logout = async () => {
       const res = await axios.get("/api/auth/logout");
       window.location.href = "/";
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
         onClick={logout}>
        <Typography sx={{color: "black", fontWeight: "bold"}}>Logout</Typography>
        </Box>
    </>
}

export default LogoutButton