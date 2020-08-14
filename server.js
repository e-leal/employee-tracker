const mysql = require('mysql2');
const index = require('./lib/index')
const express = require('express');
const inquirer = require('inquirer');
const fs = require('fs');
const PORT = process.env || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

const dbPassword = '';

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    // MySQL Username
    user: 'root',
    //mySQL password
    password: dbPassword,
    database: 'employee_recordDB'
});

connection.connect(err => {
    if (err) throw err;
});
determineAction = decision => {
    switch(decision){
        case 'View All Employees':
            viewAllEmps()
            .then(menuQuestions());
            break;
        case 'View All Departments':
            viewAllDeps()
            .then(menuQuestions());
            break;
        case 'View All Roles':
            viewAllRoles()
            .then(menuQuestions());
            break;
        case 'View All Employees By Department':
            viewEmpsByDept()
            .then(menuQuestions());
            break;
        case 'View All Employees By Manager':
            viewEmpsByManager()
            .then(menuQuestions());
            break;
        case 'Add Employee':
            addEmployee()
            .then(menuQuestions());
            break;
        case 'Add Department':
            addDepartment()
            .then(menuQuestions());
            break;
        case 'Add Role':
            addRole()
            .then(menuQuestions());
            break;
        case 'Update Employee Role':
            updateRole()
            .then(menuQuestions());
            break;
        case 'Update Employee Manager':
            updateManager()
            .then(menuQuestions());
            break;
        case 'View Budget By Department':
            viewBudget()
            .then(menuQuestions());
            break;
        case 'Remove Employee':
            removeEmp()
            .then(menuQuestions());
            break;
        default: break;
    }
    //menuQuestions();
} 
menuQuestions = () => {
    const connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        // MySQL Username
        user: 'root',
        //mySQL password
        password: dbPassword,
        database: 'employee_recordDB'
    });
    
    connection.connect(err => {
        if (err) throw err;
    });
    return inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'What would you like to do?\n',
        default: 'View All Employees',
        choices: ['View All Employees', 'View All Departments', 'View All Roles', 'View All Employees By Department', 'View All Employees By Manager', 'Add Employee', 'Add Role', 'Add Department', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager', 'View Budget By Department']
    }])
    .then(choice => {
        switch(choice.action){
            case 'View All Employees':
                viewAllEmps()
               // .then(menuQuestions());
                break;
            case 'View All Departments':
                viewAllDeps()
                //.then(menuQuestions());
                break;
            case 'View All Roles':
                viewAllRoles()
                //.then(menuQuestions());
                break;
            case 'View All Employees By Department':
                viewEmpsByDept()
              //  .then(menuQuestions());
                break;
            case 'View All Employees By Manager':
                viewEmpsByManager()
            //    .then(menuQuestions());
                break;
            case 'Add Employee':
                addEmployee()
            //    .then(menuQuestions());
                break;
            case 'Add Department':
                addDepartment()
             //   .then(menuQuestions());
                break;
            case 'Add Role':
                addRole()
             //   .then(menuQuestions());
                break;
            case 'Update Employee Role':
                updateRole()
               // .then(menuQuestions());
                break;
            case 'Update Employee Manager':
                updateManager()
               // .then(menuQuestions());
                break;
            case 'View Budget By Department':
                viewBudget()
                //.then(menuQuestions());
                break;
            case 'Remove Employee':
                removeEmp()
                // .then(menuQuestions());
                break;
            default: break;
        } 
    })
};





viewAllEmps = () => {
    const connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        // MySQL Username
        user: 'root',
        //mySQL password
        password: dbPassword,
        database: 'employee_recordDB'
    });
    
    connection.connect(err => {
        if (err) throw err;
    });
    const query = connection.query(
        "Select employee.first_name, employee.last_name, title, name, salary, CONCAT(emp.first_name, ' ', emp.last_name) Manager  from employee join role on employee.role_id = role.id join department on department.id = role.department_id left join employee emp on employee.manager_id = emp.id",
        function(err, res){
            if(err) throw err;
            console.log('\n')
            console.table(res)
            //connection.writeTextRow(rows)
           // console.log(data);
            connection.end()
            menuQuestions();
        }
    );
};

viewAllDeps = () => {
    const connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        // MySQL Username
        user: 'root',
        //mySQL password
        password: dbPassword,
        database: 'employee_recordDB'
    });
    
    connection.connect(err => {
        if (err) throw err;
    });
    const option = {sql:"select name from department", rowsAsArray: true};
    const query = connection.query(
        option, 
        function(err, res){
            if(err) throw err;
            console.log('\n')
            console.table(res)
            connection.end();
            menuQuestions();
        }
    )
}

viewAllRoles = () => {
    const connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        // MySQL Username
        user: 'root',
        //mySQL password
        password: dbPassword,
        database: 'employee_recordDB'
    });
    
    connection.connect(err => {
        if (err) throw err;
    });
    const query = connection.query(
        "Select title, salary, name from role join department on department_id = department.id",
        function(err, res){
            if(err) throw err;
            console.log('\n')
            console.table(res)
            connection.end()
            menuQuestions();
        }
    )
}

viewEmpsByDept = () => {
    const connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        // MySQL Username
        user: 'root',
        //mySQL password
        password: dbPassword,
        database: 'employee_recordDB'
    });
    
    connection.connect(err => {
        if (err) throw err;
    });
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
                        console.log('\n')
                        console.table(res)
                        connection.end()
                        menuQuestions();
                    }
                );
            }
            );
        }
    );
};

managerEmps = manager =>{
    const manId = manager;
    connection.query(
        "select employee.first_name, employee.last_name, title, name, salary, CONCAT(emp.first_name, ' ', emp.last_name) Manager  from employee join role on employee.role_id = role.id join department on department.id = role.department_id left join employee emp on employee.manager_id = emp.id where employee.?",
        {
            manager_id: manager
        },
        function(err, res){
            if(err) throw err;
            console.log('\n')
            console.table(res)
            connection.end()
            menuQuestions();
        }
    );
};

viewEmpsByManager = () => {
    const connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        // MySQL Username
        user: 'root',
        //mySQL password
        password: dbPassword,
        database: 'employee_recordDB'
    });
    
    connection.connect(err => {
        if (err) throw err;
    });
    const query = connection.query(
        "select distinct(concat(emp1.first_name, ' ', emp1.last_name)) name from employee emp1 inner join employee emp2 on emp1.id = emp2.manager_id where emp1.id = emp2.manager_id",
        function(err, res){
            if(err) throw err;
            const man = res;
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
                                console.log('\n')
                                console.table(res)
                                connection.end();
                                menuQuestions();
                            }
                        );
                     }
                 );
            });
        }
    );
    
};

addEmployee = () => {
    const connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        // MySQL Username
        user: 'root',
        //mySQL password
        password: dbPassword,
        database: 'employee_recordDB'
    });
    
    connection.connect(err => {
        if (err) throw err;
    });
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
           // connection.end();
    })
    connection.query(
        "select distinct(concat(emp1.first_name, ' ', emp1.last_name) ) name from employee emp1 inner join employee emp2 on emp1.id = emp2.manager_id where emp1.id = emp2.manager_id",
        function(err, res){
            if(err) throw err;
            for(let i = 0; i < res.length; i++){
                manList.push(res[i].name);
            }
           // connection.end();
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
            password: dbPassword,
            database: 'employee_recordDB'
        });
        
        connection.connect(err => {
            if (err) throw err;
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
                connection.query(
                    "select id from employee where first_name ='"+first+"' and last_name = '"+last+"'",
                    function(err, res){
                        if(err) throw err;
                        manId = res[0].id;
                        connection.query(
                            "Insert into employee (first_name, last_name, role_id, manager_id) values ('"+empData.firstN+"', '"+empData.lastN+"', "+roleId+", "+manId+")",
                            function(err, res){
                                if(err) throw err
                                connection.end()
                                menuQuestions();
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
    const connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        // MySQL Username
        user: 'root',
        //mySQL password
        password: dbPassword,
        database: 'employee_recordDB'
    });
    
    connection.connect(err => {
        if (err) throw err;
    });
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
                menuQuestions();
            }
        )
    });
}

addRole = () =>{
    const connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        // MySQL Username
        user: 'root',
        //mySQL password
        password: dbPassword,
        database: 'employee_recordDB'
    });
    
    connection.connect(err => {
        if (err) throw err;
    });
    const deptList = [];
    connection.query(
        "Select name from department",
        function(err, res){
            if(err) throw err;
            for( let i = 0; i < res.length; i++){
                deptList.push(res[i].name);
            }
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
            password: dbPassword,
            database: 'employee_recordDB'
        });
        
        connection.connect(err => {
            if (err) throw err;
        });
        connection.query(
            "select id from department where name ='"+addDept.newDept+"'",
            function(err, res){
                if(err) throw err;
                connection.query(
                    "Insert into role (title, salary, department_id) values ('"+addDept.newRole+"', "+addDept.newSal+", "+res[0].id+")",
                    function(err, res){
                        if(err) throw err;
                        connection.end();
                        menuQuestions();
                    }
                )
            }
        )
    });
}

updateRole = () =>{
    const connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        // MySQL Username
        user: 'root',
        //mySQL password
        password: dbPassword,
        database: 'employee_recordDB'
    });
    
    connection.connect(err => {
        if (err) throw err;
    });
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
                            password: dbPassword,
                            database: 'employee_recordDB'
                        });
                        
                        connection.connect(err => {
                            if (err) throw err;
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
                                        menuQuestions()
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

updateManager = () =>{
    const connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        // MySQL Username
        user: 'root',
        //mySQL password
        password: dbPassword,
        database: 'employee_recordDB'
    });
    
    connection.connect(err => {
        if (err) throw err;
    });
    const empList = [];
    const manList = [];
    let choseneId = 0;
    connection.query(
        "Select concat(first_name, ' ', last_name) name from employee",
        function(err, res){
            if(err) throw err;
            for( let i = 0; i < res.length; i++){
                empList.push(res[i].name);
            }
            //console.log("our available employees: ", empList);
            inquirer.prompt([{
                type: 'list',
                name: 'empChoice',
                message: "Which employee's manager would you like to update?",
                choices: empList
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
                    password: dbPassword,
                    database: 'employee_recordDB'
                });
                        
                connection.connect(err => {
                    if (err) throw err;
                });
                connection.query(
                    "select concat(first_name, ' ', last_name) name from employee where (first_name != '"+first+"' and last_name != '"+last+"')",
                    function(err, res){
                        if(err) throw err;
                        for(let i = 0; i< res.length; i++){
                            manList.push(res[i].name)
                        } 
                        inquirer.prompt([{
                            type: 'list',
                            name: 'manChoice',
                            message: "Which employee would you like to set as the manager?",
                            choices: manList
                        }])
                        .then(manData => {
                            const connection = mysql.createConnection({
                                host: 'localhost',
                                port: 3306,
                                // MySQL Username
                                user: 'root',
                                //mySQL password
                                password: dbPassword,
                                database: 'employee_recordDB'
                            })
                                    
                            connection.connect(err => {
                                if (err) throw err;
                            });
                            const manFirst = manData.manChoice.substring(0, manData.manChoice.indexOf(' '));
                            const manLast = manData.manChoice.substring(manData.manChoice.indexOf(' ')+1, manData.manChoice.length);

                            connection.query(
                                "select id from employee where first_name = '"+manFirst+"' and last_name = '"+manLast+"'",
                                function(err, res){
                                    if(err) throw err;
                                    choseneId = res[0].id;
                                    connection.query(
                                        "update employee set manager_id ="+choseneId+" where first_name = '"+first+"' and last_name = '"+last+"'",
                                        function(err, res){
                                            if(err) throw err;
                                                connection.end();
                                                menuQuestions();
                                        }
                                    )
                                }
                            )
                        })               
                    }
                )
            })
        }
    )  
}

viewBudget = () => {
    const connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        // MySQL Username
        user: 'root',
        //mySQL password
        password: dbPassword,
        database: 'employee_recordDB'
    });
    
    connection.connect(err => {
        if (err) throw err;
    });
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
                    "select SUM(salary) budget from employee join role on employee.role_id = role.id join department on department.id = role.department_id left join employee emp on employee.manager_id = emp.id where ?",
                    {
                        name: selectDep.deptChoice,
                    },
                    function(err, res){
                        if(err) throw err;
                        console.log('\n')
                        console.table(res)
                        connection.end();
                        menuQuestions()
                    }
                );
            }
            );
        }
    );
};


removeEmp = () =>{
    const connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        // MySQL Username
        user: 'root',
        //mySQL password
        password: dbPassword,
        database: 'employee_recordDB'
    });
    
    connection.connect(err => {
        if (err) throw err;
    });
    const empList = [];
    let choseneId = 0;
    connection.query(
        "Select concat(first_name, ' ', last_name) name from employee",
        function(err, res){
            if(err) throw err;
            for( let i = 0; i < res.length; i++){
                empList.push(res[i].name);
            }
            //console.log("our available employees: ", empList);
            inquirer.prompt([{
                type: 'list',
                name: 'empChoice',
                message: "Which employee's manager would you like to remove?",
                choices: empList
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
                    password: dbPassword,
                    database: 'employee_recordDB'
                });
                        
                connection.connect(err => {
                    if (err) throw err;
                });
                connection.query(
                    "delete from employee where first_name = '"+first+"' and last_name = '"+last+"'",
                    function(err, res){
                        if(err) throw err;
                        connection.end();    
                        menuQuestions();          
                    }
                )
            })
        }
    )  
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