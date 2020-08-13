const mysql2 = require('mysql2');
const fs = require('fs');
const path = require('path');

// //Connect to database
// const connection = mysql2.createConnection({
//     host: 'localhost',
//     port: 3306,
//     // MySQL Username
//     user: 'root',
//     //mySQL password
//     password: 'Mar00nday03',
//     database: 'employee_recordDB'
// });
// runSetup = () =>{
//     let commands = "";
//     fs.readFile(path.join(__dirname, 'schema.sql'), 'utf8', function(err, data){
//         if(err) throw err;
//         console.log(data);
//         commands = data;
//     });
//     connection.connect(function(err){
//         if(err) throw err;
//         connection.query(commands, function(err, res){
//             if(err) throw err;
//             console.log("setup the DB!")
//             connection.end()
//         })
//     });
// }

// runSetup();
// module.exports = dbEmp;
