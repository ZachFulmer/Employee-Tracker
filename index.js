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
    const sql = `SELECT title FROM role`;
    db.query(sql, (err, roleList) =>
    {
        if(err)
        {
            console.log("Error when attempting to retrieve all roles");
            return;
        }
        else
        {
            const newRoleList = roleList.map((role) => role.title);
            const sql = `SELECT first_name, last_name FROM employee`;
            db.query(sql, (err, employeeList) =>
            {
                if(err)
                {
                    console.log("Error when attempting to retrieve all employees");
                    return;
                }
                const newEmployeeList = employeeList.map((employee) => employee.first_name + " " + employee.last_name);
                newEmployeeList.unshift("None");

                inquirer.prompt(
                [
                    {
                        type: "text",
                        name: "first_name",
                        message: "What is the employee's first name?"
                    },
                    {
                        type: "text",
                        name: "last_name",
                        message: "What is the employee's last name?"
                    },
                    {
                        type: "list",
                        name: "role",
                        message: "What is the employee's role??",
                        choices: newRoleList
                    },
                    {
                        type: "list",
                        name: "manager",
                        message: "Who is the employee's manager?",
                        choices: newEmployeeList
                    }
                ]).then((data) =>
                {
                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                VALUES
                                    ("${data.first_name}", "${data.last_name}", ${newRoleList.indexOf(data.role) + 1}, ${data.manager == "None" ? null : newEmployeeList.indexOf(data.manager)})`;
        
                    db.query(sql, (err, result) =>
                    {
                        if(err)
                        {
                            console.log("Error when attempting to add an employee " + err.message);
                            return;
                        }
                        console.log(`Added ${data.first_name} ${data.last_name} to the database`);
                        main();
                    });
                });
            });
        }
    });
}

// Update Employee Info
function updateEmployee()
{
    const sql = `SELECT title FROM role`;
    db.query(sql, (err, roleList) =>
    {
        if(err)
        {
            console.log("Error when attempting to retrieve all roles");
            return;
        }
        else
        {
            const newRoleList = roleList.map((role) => role.title);
            const sql = `SELECT first_name, last_name FROM employee`;
            db.query(sql, (err, employeeList) =>
            {
                if(err)
                {
                    console.log("Error when attempting to retrieve all employees");
                    return;
                }
                const newEmployeeList = employeeList.map((employee) => employee.first_name + " " + employee.last_name);

                inquirer.prompt(
                [
                    {
                        type: "list",
                        name: "employee",
                        message: "Which employee's role do you want to update?",
                        choices: newEmployeeList
                    },
                    {
                        type: "list",
                        name: "role",
                        message: "Which role do you want to assign the selected employee?",
                        choices: newRoleList
                    }
                ]).then((data) =>
                {
                    const sql = `UPDATE employee SET role_id = ${newRoleList.indexOf(data.role) + 1}
                                WHERE id = ${newEmployeeList.indexOf(data.employee) + 1}`;
        
                    db.query(sql, (err, result) =>
                    {
                        if(err)
                        {
                            console.log("Error when attempting to update an employee's role " + err.message);
                            return;
                        }
                        console.log(`Updated ${data.employee}'s role to ${data.role} in the database`);
                        main();
                    });
                });
            });
        }
    });
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
    const sql = `SELECT name FROM department`;
    db.query(sql, (err, rows) =>
    {
        if(err)
        {
            console.log("Error when attempting to retrieve all departments");
        }
        inquirer.prompt(
        [
            {
                type: "text",
                name: "role_name",
                message: "What is the name of the role?"
            },
            {
                type: "number",
                name: "salary",
                message: "What is the salary of the role?"
            },
            {
                type: "list",
                name: "department",
                message: "Which department does the role belong to?",
                choices: rows
            }
        ]).then((data) =>
        {
            let i = 0;
            for(i = 0; i < rows.length; i++)
            {
                if(data.department == rows[i].name)
                {
                    break;
                }
            }
            const sql = `INSERT INTO role (title, salary, department_id)
                        VALUES
                            ("${data.role_name}", ${data.salary}, ${i+1})`;

            db.query(sql, (err, result) =>
            {
                if(err)
                {
                    console.log("Error when attempting to add a department " + err.message);
                    return;
                }
                console.log(`Added ${data.role_name} to the database`);
                main();
            });
        });
    });
}

// ****** Department Functions ******
// View all departments
function viewAllDepartments()
{
    const sql = `SELECT * FROM department`;

    db.query(sql, (err, rows) => {
        if (err) {
            console.log("Error when attempting to view all departments");
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
                console.log("Error when attempting to add a department");
                return;
            }
            console.log(`Added ${department_name} to the database`);
            main();
        });
    })
}

main();