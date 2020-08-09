const mysql = require('mysql2');
const db = require('./db/database');
const express = require('express');
const inquirer = require('require');
const fs = require('fs');
const Employee = require('./lib/Employee');
const PORT = process.env || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());