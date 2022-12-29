import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { destroyCookie, parseCookies } from "nookies";

const logout = (req: NextApiRequest, res: NextApiResponse) => {
    destroyCookie({ res }, "user");
    res.status(200).redirect("/");
}

export default logout