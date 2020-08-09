const mysql2 = require('mysql2').verbose();

//Connect to database
const dbEmp = new mysql2.Database('./db/employee.db', err => {
    if(err){
        return console.error(err.message);
    }
    console.log('Connected to the employee database.');
});

const dbDept = new mysql2.Database('./db/department.db', err =>{
    if(err){
        return console.error(err.message);
    }
    console.log('Connected to the department database.');
});

const dbRole = new mysql2.Database('./db/role.db', err =>{
    if(err){
        return console.error(err.message);
    }
    console.log('Connected to the role database.');
});



module.exports = dbEmp;
module.exports = dbDept;
module.exports = dbRole;