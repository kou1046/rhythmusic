import { NextApiRequest, NextApiResponse } from "next";
import { destroyCookie, parseCookies} from "nookies";
 
const logout = async (req: NextApiRequest, res: NextApiResponse) => {
    destroyCookie({ res }, "user", {
        path: "/"
    });
    res.redirect(`${process.env.HOST_NAME}`);
}

export default logout