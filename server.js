const inquirer = require('inquirer');
const db = require('./config/connection');
const utils = require("util");
const query = utils.promisify(db.query);

function startApp() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "userAction",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "Quit",
        ],

      },
    ])

    .then((options) => {
      console.log(options);
      switch (options.userAction) {
        case "View all departments":
          viewDepts();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "View all employees":
          viewEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRoleAA();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee role":
          updateEmployee();
          break;
        case "Quit":
          db.end();
      }
    });
}

function viewDepts() {
  db.promise().query('SELECT * FROM department').then(function (dataFromTable) {
    console.table(dataFromTable[0]);
    startApp();
  })
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "deptName",
        message: "What department would you like to add?",
      },
    ])
    .then((options) => {
      console.log(options);
      db.promise().query('INSERT INTO department SET?', {
        name: options.deptName,
      }).then(function (dataFromTable) {
        console.table(dataFromTable[0]);
        startApp();
      })
    });
}
startApp();