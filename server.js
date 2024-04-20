const inquirer = require('inquirer');
const db = require('./config/connection');
const utils = require("util");
const { clear } = require('console');
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
          addRole();
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

function viewRoles() {
  db.promise().query('SELECT * FROM role').then(function (dataFromTable) {
    console.table(dataFromTable[0]);
    startApp();
  })
}

function viewEmployees() {
  db.promise().query('SELECT * FROM employee').then(function (dataFromTable) {
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

function addRole() {

  inquirer
    .prompt([
      {
        type: "input",
        name: "roleName",
        message: "What role would you like to add?"
      },
      {
        type: "number",
        name: "salary",
        message: "What is the positions salary amount?"
      },
    ])
    .then(({ roleName, salary }) => {
      db.query('SELECT name, id FROM department', (err, result) => {
        const department = result.map(({ name, id }) => ({ name, value: id }));

        inquirer
          .prompt([
            {
              type: "list",
              name: "deptId",
              message: "Which department would you like to add this role to?",
              choices: department
            },
          ])
          .then(({ deptId }) => {
            console.log(deptId);
            db.promise().query('INSERT INTO role SET?', {
              title: roleName,
              salary: salary,
              department_id: deptId
            }).then(function (dataFromTable) {
              console.table(dataFromTable[0]);
              startApp();
            })
          })
      })
    });
}

async function addEmployee() {
  const roles = await db.promise().query('SELECT * FROM role');
  const roleArray = roles[0].map(role => ({ name: role.title, value: role.id }));
  const managers = await db.promise().query('SELECT * FROM employee');
  const managerArray = managers[0].map(manager => ({ name: manager.first_name + " " + manager.last_name, value: manager.id }));
  console.log(roleArray, managerArray);
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "Whats employees first name?",
      },
      {
        type: "input",
        name: "last_name",
        message: "Whats employees last name?",
      },
      {
        type: "list",
        name: "role_id",
        message: "Chose employee role",
        choices: roleArray
      },
      {
        type: "list",
        name: "manager_id",
        message: "Chose your employees manager",
        choices: managerArray
      },

    ])
    .then((answers) => {
      console.log(answers);
      db.promise().query('INSERT INTO employee SET?', answers).then(function (dataFromTable) {
        console.table(dataFromTable[0]);
        startApp();
      })
    })
}

async function updateEmployee() {
  const roles = await db.promise().query('SELECT * FROM role');
  const roleArray = roles[0].map(role => ({ name: role.title, value: role.id }));
  const managers = await db.promise().query('SELECT * FROM employee');
  const managerArray = managers[0].map(manager => ({ name: manager.first_name + " " + manager.last_name, value: manager.id }));

  inquirer.prompt([{
    type: "list",
    name: "employee",
    message: "Which employee would you like to update?",
    choices: managerArray
  }, {
    type: "list",
    name: "role_id",
    message: "Chose employee role",
    choices: roleArray
  }]).then(({ employee, role_id }) => {
    db.promise().query(`UPDATE employee SET role_id = ? WHERE id = ?`, [role_id, employee]).then(function (dataFromTable) {
      console.table(dataFromTable[0]);
      startApp();
    });
  })
}
startApp();

