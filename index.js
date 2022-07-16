const inquirer = require("inquirer");
const cTable = require('console.table');
const db = require('./db/connection');

function main()
{
    inquirer.prompt(
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"]
        }).then(({ action }) => 
        {
            console.log(action);
            switch(action)
            {
                case "View All Employees":
                    viewAllEmployees();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Update Employee Role":
                    updateEmployee();
                    break;
                case "View All Roles":
                    viewAllRoles();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "View All Departments":
                    viewAllDepartments();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "Quit":
                    console.log("Exiting Application...Press CTRL+C to terminate the connection");
                    break;
            }
        });
}

// ****** Employee Functions ******
// View All Employees
function viewAllEmployees()
{
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, concat(m.first_name," ", m.last_name) manager
                FROM employee
                JOIN role ON employee.role_id = role.id
                JOIN department ON role.department_id = department.id
                LEFT JOIN employee m ON employee.manager_id = m.id`;

    db.query(sql, (err, rows) => {
      if (err) 
      {
        console.log("Error when attempting to view all employees")
        return;
      }
      console.table(rows);
      main();
    });
}
// Add Employee
function addEmployee()
{
    console.log("Employee Added");
}

// Update Employee Info
function updateEmployee()
{
    console.log("Employee Updated");
}

// ****** Role Functions ******
// Veiw All Roles
function viewAllRoles()
{
    const sql = `SELECT role.id, role.title, department.name AS department, role.salary 
                FROM role
                JOIN department ON role.department_id = department.id`;

    db.query(sql, (err, rows) => {
        if (err) 
        {
          console.log("Error when attempting to view all roles")
          return;
        }
        console.table(rows);
        main();
    });
}

// Add Role
function addRole()
{
    
}

// ****** Department Functions ******
// View all departments
function viewAllDepartments()
{
    const sql = `SELECT * FROM department`;

    db.query(sql, (err, rows) => {
        if (err) {
            console.log("Error when attempting to view all departments")
            return;
        }
        console.table(rows);
        main();
    });
}

// Add Department
function addDepartment()
{
    inquirer.prompt(
        {
            type: "text",
            name: "department_name",
            message: "What is the name of the department?"
        }
    ).then(({department_name}) =>
    {
        const sql = `INSERT INTO department (name)
                    VALUES
                        (?);`;

        db.query(sql, department_name, (err, result) => {
            if (err) {
                console.log("Error when attempting to add a department")
                return;
            }
            console.table(`Added ${department_name} to the database`);
            main();
        });
    })
}

main();