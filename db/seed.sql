Insert into department (name) values ('Sales');
Insert into department (name) values ('Finance');
Insert into department (name) values ('Legal');
Insert into department (name) values ('Engineering');

Insert into role (title, salary, department_id) values ('Sales Lead', 100000, 1);
Insert into role (title, salary, department_id) values ('Salesperson', 70000,  1);
Insert into role (title, salary, department_id) values ('Accountant', 75000,  2);
Insert into role (title, salary, department_id) values ('Software Engineer', 80000, 4);
Insert into role (title, salary, department_id) values ('Legal Team Lead', 120000, 3);

Insert into employee (first_name, last_name, role_id, manager_id) values ('Ashley', 'Smith', 1, null);
Insert into employee (first_name, last_name, role_id, manager_id) values ('Steve', 'Rogers', 5, null);
Insert into employee (first_name, last_name, role_id, manager_id) values ('Natasha', 'Romanov', 2, 1);
Insert into employee (first_name, last_name, role_id, manager_id) values ('Bruce', 'Banner', 4, null);