import cryptoRandomString from 'crypto-random-string';
import { assert } from 'console';
import dbConnect, {Request, TYPES} from './connection.js';


// Fetches the unique cryptographic hash for the user.
export async function fetchCode(username) {
  const connection = await dbConnect();
  var code = '';

  return new Promise((resolve, reject) => {
    var fetchCodeReq = new Request("SELECT code FROM Users WHERE username = @username;", function(error) {
      if (error && error.number == 2627) {
        reject(error);
      } else {
        resolve(code);
      }
    }) 

    fetchCodeReq.on('row', row);

    fetchCodeReq.on('requestCompleted', function () {
      console.log("fetchCode: connection closed");
      connection.close();
    });

    // Simply insert the values into the table for now
    fetchCodeReq.addParameter('username', TYPES.VarChar, username);
    connection.execSql(fetchCodeReq);
  })

  function row(columns) {
    assert(columns.length == 1);
    columns.forEach((column) => {
      code = column.value;
    });
  }
}

// Returns all user code pairs in the database in a params array.
export async function fetchUserCodes(username) {
  const connection = await dbConnect();
  var username = '';
  var code = '';
  var userCodes = []

  return new Promise((resolve, reject) => {
    var fetchUserCodeReq = new Request("SELECT username, code FROM Users WHERE username = @username;", function(error) {
      if (error && error.number == 2627) {
        reject(error);
      } else {
        resolve(userCodes);
      }
    }) 

    fetchUserCodeReq.on('row', row);

    fetchUserCodeReq.on('requestCompleted', function () {
      console.log("fetchUserCodes: connection closed");
      connection.close();
    });

    // Simply insert the values into the table for now
    fetchUserCodeReq.addParameter('username', TYPES.VarChar, username);
    connection.execSql(fetchUserCodeReq);
  })

  function row(columns) {
    columns.forEach((column) => {
      if (column.colName == "username") {
        username = column.value;
      } else if (column.colName === "code") {
        code = column.value;
      }
    });
    userCodes.push({params: {username, code}});
  }
}

// Returns all user code pairs in the database in a params array.
export async function fetchAllCodes(username) {
  const connection = await dbConnect();
  var codes = []

  return new Promise((resolve, reject) => {
    var fetchAllCodesReq = new Request("SELECT code FROM Users", function(error) {
      if (error && error.number == 2627) {
        reject(error);
      } else {
        resolve(codes);
      }
    }) 

    fetchAllCodesReq.on('row', row);

    fetchAllCodesReq.on('requestCompleted', function () {
      console.log("fetchAllCodesReq: connection closed");
      connection.close();
    });

    // Simply insert the values into the table for now
    connection.execSql(fetchAllCodesReq);
  })

  function row(columns) {
    columns.forEach((column) => {
      codes.push({params: {code: column.value}})
    });
  }
}
