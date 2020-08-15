# employee-tracker

## Description
The Employee-Tracker is an express app used to manage a given company's employees. Once initiated, the user is presented with prompt to select one of the following options:
'View All Employees'
'View All Departments'
'View All Roles'
'View All Employees By Department'
'View All Employees By Manager'
'Add Employee'
'Add Role'
'Add Department'
'Remove Employee'
'Update Employee Role'
'Update Employee Manager'
'View Budget By Department'
Each of the 'View ...' options will display the employees that meet the selected criteria in a user friendly display.
Each of the 'Add ..' options will allow the user to enter information to get the selected object added.
Each of the 'Update ...' options will allow the user to update the selected object.

## Installation
Once the repository is cloned, you will need to install the following packages:
inquirer, mysql2, console.table, and express. You can do this by running the following command: 'npm install {package_name}'

## Usage
In order to use the application, you will need to navigate to the directory where the server.js file is located and apply your mysql password to the dbPassword variable. Then you will need to create the employee_recordDB by running: 'mysql -u root -p' -> enter your password -> 'source schema.sql' -> 'source seed.sql' (optional- this will provide any initial sample data) -> exit.
Once those steps are completed, you can run the application by using the following command: 'npm start'

[Demo-Walkthrough](https://drive.google.com/file/d/1yWUH9RTLJQXmi5uoD34qUoePJ8L-qK_c/view) 