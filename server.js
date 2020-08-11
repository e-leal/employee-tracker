const mysql = require('mysql2');
const db = require('./db/database');
const questions = require('./lib/index')
const express = require('express');
const inquirer = require('inquirer');
const fs = require('fs');
const Employee = require('./lib/Employee');
const PORT = process.env || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    // MySQL Username
    user: 'root',
    //mySQL password
    password: '',
    database: 'employee_recordDB'
});

connection.connect(err => {
    if (err) throw err;
    console.log('Connected as id '+ connection.threadId + '\n');
});


menuQuestions = () => {
    return inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'What would you like to do?\n',
        default: 'View All Employees',
        choices: ['View All Employees', 'View All Employees By Department', 'View All Employees By Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager']
    }])
    .then(choice => {
        determineAction(choice.action);
    });
};

determineAction = decision => {
    if(decision === 'View All Employees'){
        viewAllEmps();
    }else if(decision === 'View All Employees By Department'){
        viewEmpsByDept();
    }else if(decision === 'View All Employees By Manager'){
        viewEmpsByManager();
    }
    //return menuQuestions();
}



viewAllEmps = () => {
    const query = connection.query(
        "Select employee.first_name, employee.last_name, title, name, salary, CONCAT(emp.first_name, ' ', emp.last_name) Manager  from employee join role on employee.role_id = role.id join department on department.id = role.department_id left join employee emp on employee.manager_id = emp.id",
        function(err, res){
            if(err) throw err;
            console.log(res);
            connection.end();
        }
    );
};

viewEmpsByDept = () => {
    const query = connection.query(
        "select name from department",
        function(err, res){
            if(err) throw err;
            const depts = res;
            inquirer.prompt(
                [{
                    type: 'list',
                    name: "deptChoice",
                    message: "Which department?\n",
                    choices: res
                }]
            )
            .then(selectDep => {
                connection.query(
                    "select employee.first_name, employee.last_name, title, name, salary, CONCAT(emp.first_name, ' ', emp.last_name) Manager  from employee join role on employee.role_id = role.id join department on department.id = role.department_id left join employee emp on employee.manager_id = emp.id where ?",
                    {
                        name: selectDep.deptChoice,
                    },
                    function(err, res){
                        if(err) throw err;
                        console.log(res);
                        connection.end();
                    }
                );
            }
            );
        }
    );
};

managerEmps = manager =>{
    console.log("Our passed in value is: ", manager);
    const manId = manager;
    connection.query(
        "select employee.first_name, employee.last_name, title, name, salary, CONCAT(emp.first_name, ' ', emp.last_name) Manager  from employee join role on employee.role_id = role.id join department on department.id = role.department_id left join employee emp on employee.manager_id = emp.id where employee.?",
        {
            manager_id: manager
        },
        function(err, res){
            if(err) throw err;
            console.log(res);
            connection.end();
        }
    );
};

viewEmpsByManager = () => {
    const query = connection.query(
        "select concat(emp1.first_name, ' ', emp1.last_name) name from employee emp1 inner join employee emp2 on emp1.id = emp2.manager_id where emp1.id = emp2.manager_id",
        function(err, res){
            if(err) throw err;
            const man = res;
            console.log("our res is: ", res);
            inquirer.prompt(
                [{
                    type: 'list',
                    name: "managerChoice",
                    message: "Which manager?\n",
                    choices: man
                }]
            )
            .then(selectManagerName => {
                console.log("our inputed value is: ", selectManagerName.managerChoice.substring(0,selectManagerName.managerChoice.indexOf(' ')));
                console.log("our last_name is read as: ", selectManagerName.managerChoice.substring(selectManagerName.managerChoice.indexOf(' ')+1, selectManagerName.managerChoice.length));
                const first = selectManagerName.managerChoice.substring(0,selectManagerName.managerChoice.indexOf(' '));
                const last = selectManagerName.managerChoice.substring(selectManagerName.managerChoice.indexOf(' ')+1, selectManagerName.managerChoice.length);
                connection.query(
                     "select id from employee where first_name = '"+first+"' and last_name = '"+last+"'",
                     function(err, res){
                         if(err) throw err;
                         
                         const manager = res[0].id;
                         connection.query(
                            "select employee.first_name, employee.last_name, title, name, salary, CONCAT(emp.first_name, ' ', emp.last_name) Manager  from employee join role on employee.role_id = role.id join department on department.id = role.department_id left join employee emp on employee.manager_id = emp.id where emp.id ='"+manager+"'",
                            function(err, res1){
                                if(err) throw err;
                                console.log(res1);
                                connection.end();
                            }
                        );
                     }
                 );
            });
        }
    );
    
};

menuQuestions();

// Default response for any other request(Not Found) Catch all
app.use((req, res) => {
    res.status(404).end();
  });
// Start server after DB connection
connection.on('open', () => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });