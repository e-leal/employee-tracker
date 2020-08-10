const inquirer = require('inquirer');
const fs = require('fs');
const Employee = require('./Employee');
const mysql = require('mysql2');

// const connection = mysql.createConnection({
//     host: 'localhost',
//     port: 3306,
//     // MySQL Username
//     user: 'root',
//     //mySQL password
//     password: 'Mar00nday03',
//     database: 'employee_recordDB'
// });

// connection.connect(err => {
//     if (err) throw err;
//     console.log('Connected as id '+ connection.threadId + '\n');
// });


// menuQuestions = () => {
//     return inquirer.prompt([{
//         type: 'list',
//         name: 'action',
//         message: 'What would you like to do?',
//         default: 'View All Employees',
//         choices: ['View All Employees', 'View All Employees By Department', 'View All Employees By Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager']
//     }])
//     .then(choice => {
//         if(choice.action === 'View All Employees'){
//             viewAllEmps();
//         }
//     });
// };



// viewAllEmps = () => {
//     const query = connection.query(
//         "Select employee.first_name, employee.last_name, title, name, salary, CONCAT(emp.first_name, ' ', emp.last_name) Manager  from employee join role on employee.role_id = role.id join department on department.id = role.department_id left join employee emp on employee.manager_id = emp.id",
//         function(err, res){
//             if(err) throw err;
//             console.log(res);
//             connection.end();
//         });
    
//     };


