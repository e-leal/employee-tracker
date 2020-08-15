const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql2');
const express = require('express');
const PORT = process.env || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());
