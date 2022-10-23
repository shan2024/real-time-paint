import cryptoRandomString from 'crypto-random-string';
import dbConnect, {Request, TYPES, connection} from './connection.js';

// Inserts the specified User into the database. Returns true on successful insert, false
// otherwise.
export async function insertUser(username, password, email) {
  // Set the unique code for the user
  const code = cryptoRandomString({length: 10, type: 'url-safe'});

  //const connection = await dbConnect();
  var didInsert = false;

  return new Promise((resolve, reject) => {
    var insertUserReq = new Request("INSERT INTO Users VALUES (@username, @password, @email, @code);", function(error) {
      if (error && error.number == 2627) {
        reject(error);
      } else {
        resolve(didInsert);
      }
    }) 

    insertUserReq.on('done', function (rowCount) {
      console.log("inserUser: inserted " + rowCount + " users");
      didInsert = true;
    });

    insertUserReq.on('doneInProc', function (rowCount) {
      console.log("inserUser: inserted " + rowCount + " users");
      didInsert = true;
    });

    insertUserReq.on('doneProc', function (rowCount) {
      console.log("inserUser: inserted " + rowCount + " users");
      didInsert = true;
    });

    insertUserReq.on('requestCompleted', function () {
      console.log("insertUser: connection closed");
      //connection.close();
    });

    // Simply insert the values into the table for now
    insertUserReq.addParameter('username', TYPES.VarChar, username);
    insertUserReq.addParameter('password', TYPES.VarChar, password);
    insertUserReq.addParameter('email', TYPES.VarChar, email);
    insertUserReq.addParameter('code', TYPES.VarChar, code);

    connection.execSql(insertUserReq);
  })
}

// Checks whether the user is currently present in the database. Returns true if
// the database already contains user, false otherwise.
export async function checkUser(username) {
  //const connection = await dbConnect();
  var hasUser = false;

  return new Promise((resolve, reject) => {
    var checkUserReq = new Request("SELECT u.username FROM Users as u WHERE u.username = @username;", function(error) {
      if (error) {
        reject(error);
      } else {
        resolve(hasUser);
      }
    });

    checkUserReq.on('done', function(rowCount) {
      console.log("row count of user is " + rowCount)
      if (rowCount > 0) {
        hasUser = true;
      }
    })

    checkUserReq.on('doneInProc', function(rowCount) {
      console.log("row count of user is " + rowCount)
      if (rowCount > 0) {
        hasUser = true;
      }
    })

    checkUserReq.on('doneProc', function(rowCount) {
      console.log("row count of user is " + rowCount)
      if (rowCount > 0) {
        hasUser = true;
      }
    })

    checkUserReq.on('requestCompleted', function () {
      console.log("checkUser: connection closed");
      //connection.close();
    });

    checkUserReq.addParameter('username', TYPES.VarChar, username);
    connection.execSql(checkUserReq);
  })
  
}

// Fetch all users from the database. Returns an array of users that looks like this:
// [
//   {
//     params: {
//       username: 'Alice'
//     }
//   }
// ]
export async function fetchAllUsers() {
  //const connection = await dbConnect();
  var users = [];

  return new Promise((resolve, reject) => {
    var fetchAllUsers = new Request("SELECT username FROM Users;", function(error) {
      if (error && error.number == 2627) {
        reject(error);
      } else {
        console.log(users)
        resolve(users);
      }
    }) 

    fetchAllUsers.on('row', row);

    fetchAllUsers.on('requestCompleted', function () {
      console.log("fetchAllUsers: connection closed");
      //connection.close();
    });
  
    connection.execSql(fetchAllUsers);
  })

  function row(columns) {
    columns.forEach((column) => {
      users.push({params: {username: column.value}});
    });
  }
}



