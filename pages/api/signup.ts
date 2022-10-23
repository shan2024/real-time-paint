import { NextApiRequest, NextApiResponse } from "next";
import {checkUser, insertUser} from '../../db/users.js';

type ErrorResponse = {
  error: string
}

type Data = {
  userInserted: boolean
}

// Handler takes in a username, email, and password from user, and adds it to the database 
// if they do not already exist. Returns a boolean saying whether the user was successfully
// inserted.
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | ErrorResponse>) {
  
  const body = req.body;

  console.log("body: ", body);

  if (!body.username || !body.password || !body.email ) {
    res.status(400).json({error: "You are missing a username, email, or password!"});
  }

  // Check whether user exists in database
  var userExists = await checkUser(body.username);
  console.log("user exist status: " + userExists);

  // If not, then safely insert user into database
  var didInsertUser = false;
  if (!userExists) {
    didInsertUser =  await insertUser(body.username, body.password, body.email);
  }

  console.log("inserted user");
  res.status(200).json({userInserted: didInsertUser});
 
}