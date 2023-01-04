import { Box } from "@mui/material"
import axios from "axios"
import { KeyedMutator } from "swr/_internal"
import { ResponseType } from "../../../pages/api/auth/login"

type PropsType = {
    loginMutate: KeyedMutator<ResponseType>
}

export const LogoutButton = ({ loginMutate }: PropsType) => {

    const logout = async () => {
        const res = await axios.get("/api/auth/logout"); 
        loginMutate();
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
        Logout
        </Box>
    </>
}