import { connect } from 'http2';

// Config for connecting to database
var config = {
  server: `${process.env.AZURE_URL}`,
  authentication: {
    type: "default",
    options: {
      userName: `${process.env.AZURE_USER}`,
      password: `${process.env.AZURE_PASS}`
    }
  },
  options: {
    encrypt: true,
    database: "live-draw-db"
  }
}


var tedious = require('tedious');
var Connection = tedious.Connection;
export var Request = tedious.Request;
export var TYPES = tedious.TYPES;

export default async function dbConnect() {
  var connection = new Connection(config);

  return new Promise((resolve, reject) => {
    connection.on("connect", function(error) {
      if (error) {
        // If we get a Timeout error, try again later
        if (error.code == "ETIMEOUT") {
          connection.connect();
        } else {
          reject(error);
        }
      } else {
        console.log("connected to database");
        resolve(connection);
      }
    })
    connection.connect();
  })
}