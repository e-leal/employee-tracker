const mysql = require('mysql2');
const db = require('./db/database');
const questions = require('./lib/index')
const express = require('express');
const inquirer = require('inquirer');
const fs = require('fs');
const Employee = require('./lib/Employee');
const { forInStatement, tsConstructSignatureDeclaration } = require('@babel/types');
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
        choices: ['View All Employees', 'View All Departments', 'View All Roles', 'View All Employees By Department', 'View All Employees By Manager', 'Add Employee', 'Add Role', 'Add Department', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager']
    }])
    .then(choice => {
        determineAction(choice.action);
    });
};

determineAction = decision => {
    switch(decision){
        case 'View All Employees':
            viewAllEmps();
            break;
        case 'View All Departments':
            viewAllDeps();
            break;
        case 'View All Roles':
            viewAllRoles();
            break;
        case 'View All Employees By Department':
            viewEmpsByDept();
            break;
        case 'View All Employees By Manager':
            viewEmpsByManager();
            break;
        case 'Add Employee':
            addEmployee();
            break;
        case 'Add Department':
            addDepartment();
            break;
        case 'Add Role':
            addRole();
            break;
        case 'Update Employee Role':
            updateRole();
            break;
        default: break;
    }
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

viewAllDeps = () => {
    const query = connection.query(
        "Select name from department",
        function(err, res){
            if(err) throw err;
            console.log(res);
            connection.end();
        }
    )
}

viewAllRoles = () => {
    const query = connection.query(
        "Select title, salary, name from role join department on department_id = department.id",
        function(err, res){
            if(err) throw err;
            console.log(res);
            connection.end();
        }
    )
}


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
        "select distinct(concat(emp1.first_name, ' ', emp1.last_name)) name from employee emp1 inner join employee emp2 on emp1.id = emp2.manager_id where emp1.id = emp2.manager_id",
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

addEmployee = () => {
    const manList = [];
    const roles  = [];
    //console.log("our role list is: ", roles);
    connection.query(
        "Select title from role",
        function(err, res){
            if(err) throw err;
            for( let i = 0; i < res.length; i++){
                roles.push(res[i].title);
            }
           // console.log("our available titles ", roles);
            connection.end();
    })
    connection.query(
        "select distinct(concat(emp1.first_name, ' ', emp1.last_name) ) name from employee emp1 inner join employee emp2 on emp1.id = emp2.manager_id where emp1.id = emp2.manager_id",
        function(err, res){
            if(err) throw err;
            for(let i = 0; i < res.length; i++){
                manList.push(res[i].name);
            }
            connection.end();
        }
    )
    console.log("our available roles are: ",roles);
    inquirer.prompt([{
        type: 'input',
        name: 'firstN',
        message: "Enter Employee's first name: ",
    },
    {
        type: 'input',
        name: 'lastN',
        message: "Enter employee's last name: "
    },
    {
        type: 'list',
        name: 'roleChoice',
        message: "Select employee's role: ",
        choices: roles
    },
    {
        type: 'list',
        name: 'manChoice',
        message: "Select employee's manager: ",
        choices: manList
    }])
    .then(empData =>{
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
        const manager = empData.manChoice;
        const rolePick = empData.roleChoice;
        const first = manager.substring(0,manager.indexOf(' '));
        const last = manager.substring(manager.indexOf(' ')+1, manager.length);
        let manId = 0;
        let roleId = 0;
        connection.query(
            'select id from role where ?',
            {
                title: rolePick
            },
            function(err, res){
                if(err) throw err;
                roleId = res[0].id
                console.log("Role ID: ", roleId);
                connection.query(
                    "select id from employee where first_name ='"+first+"' and last_name = '"+last+"'",
                    function(err, res){
                        if(err) throw err;
                        console.log(res[0].id);
                        manId = res[0].id;
                        connection.query(
                            "Insert into employee (first_name, last_name, role_id, manager_id) values ('"+empData.firstN+"', '"+empData.lastN+"', "+roleId+", "+manId+")",
                            function(err, res){
                                if(err) throw err
                                console.log("we've updated our employee table!")
                                connection.end()
                            }
                        );
                    }
                )
            }
        );
        
        //console.log("Insert into employee (first_name, last_name, role_id, manager_id) values ('"+empData.firstN+"', '"+empData.lastN+"', "+roleId+", "+manId+")");
        
    });
}

addDepartment = () =>{
    inquirer.prompt([{
        type: 'input',
        name: 'newDept',
        message: 'Enter deparmtent name: '
    }])
    .then(addDept => {
        connection.query(
            "Insert into department (name) values ('"+addDept.newDept+"')",
            function(err, res){
                if(err) throw err;
                console.log("Succesfully added new department!");
                connection.end();
            }
        )
    });
}

addRole = () =>{
    const deptList = [];
    connection.query(
        "Select name from department",
        function(err, res){
            if(err) throw err;
            for( let i = 0; i < res.length; i++){
                deptList.push(res[i].name);
            }
            console.log("our available departments: ", deptList);
            connection.end();
    });
    inquirer.prompt([{
        type: 'input',
        name: 'newRole',
        message: 'Enter Role name: '
    },
    {
       type:  'number',
       name: 'newSal',
       message: 'Enter salary for new role: $'
    },
    {
        type: 'list',
        name: 'newDept',
        message: 'Select department for new role: ',
        choices: deptList
    }])
    .then(addDept => {
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
        connection.query(
            "select id from department where name ='"+addDept.newDept+"'",
            function(err, res){
                if(err) throw err;
                connection.query(
                    "Insert into role (title, salary, department_id) values ('"+addDept.newRole+"', "+addDept.newSal+", "+res[0].id+")",
                    function(err, res){
                        if(err) throw err;
                        console.log("Succesfully added new role!");
                        connection.end();
                    }
                )
            }
        )
    });
}

updateRole = () =>{
    const empList = [];
    const roleList = [];
    let chosenRoleId = 0;
    connection.query(
        "Select concat(first_name, ' ', last_name) name from employee",
        function(err, res){
            if(err) throw err;
            for( let i = 0; i < res.length; i++){
                empList.push(res[i].name);
            }
            //console.log("our available employees: ", empList);
            connection.query(
                "select title from role",
                function(err, res){
                    if(err) throw err;
                    for(let i = 0; i< res.length; i++){
                        roleList.push(res[i].title);
                    }
                    inquirer.prompt([{
                        type: 'list',
                        name: 'empChoice',
                        message: 'Select employee to update their role: ',
                        choices: empList
                    },
                    {
                        type: 'list',
                        name: 'roleChoice',
                        message: 'Select a role for the employee: ',
                        choices: roleList   
                    }])
                    .then(newData => {
                        const first = newData.empChoice.substring(0,newData.empChoice.indexOf(' '));
                        const last = newData.empChoice.substring(newData.empChoice.indexOf(' ')+1, newData.empChoice.length)
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
                        connection.query(
                            "select id from role where title = '"+newData.roleChoice+"'",
                            function(err, res){
                                if(err) throw err;
                                chosenRoleId = res[0].id;
                                connection.query(
                                    "update employee set role_id = "+chosenRoleId+" where first_name = '"+first+"' and last_name = '"+last+"'",
                                    function(err, res){
                                        if(err) throw err;
                                        console.log("Successfully updated employee's role!")
                                        connection.end()
                                    }
                                )
                                connection.end();
                            }

                        )
                
                    })
                }
            )
    });
    
}

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