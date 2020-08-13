DROP DATABASE IF EXISTS employee_recordDB;

create DATABASE employee_recordDB;

USE employee_recordDB;

CREATE TABLE DEPARTMENT (
    id INTEGER(11) AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE ROLE (
    id INTEGER(11) AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL(19),
    department_id INTEGER(11),
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) references department(id)
    ON DELETE CASCADE
);

CREATE TABLE employee (
    id INTEGER(11) AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER(11),
    manager_id INTEGER(11),
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) references ROLE(id), 
    FOREIGN KEY (manager_id) references employee(id) 
        ON DELETE SET NULL
);


