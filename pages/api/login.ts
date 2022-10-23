import { NextApiRequest, NextApiResponse } from "next";
import {checkUser, insertUser} from '../../db/users.js';

type ErrorResponse = {
  error: string
}

type Data = {
  userExists: boolean
}

// Handler recieves json with username and password, send back true if the user does exist in database
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | ErrorResponse>) {
  if (req.method === "PUT") {
    const body = req.body;

    if (!body.username || !body.password) {
      res.status(400).json({error: "You are missing a username or password!"});
    }
  
    // Check whether user exists in database
    var doesUserExist = await checkUser(body.username);
    console.log("user exist status: " + doesUserExist);
  
    // Send back result as json
    res.status(200).json({userExists: doesUserExist});
  }
}