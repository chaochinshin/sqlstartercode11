const { prompt } = require("inquirer");
//const inquirer = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");
require("console.table");

init();

// Display logo text, load main prompts
function init() {
  const logoText = logo({ name: "Employee Manager" }).render();

  console.log(logoText);

  loadMainPrompts();
}

async function loadMainPrompts() {
  const { choice } = await prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        {
          name: "View All Employees",
          value: "VIEW_EMPLOYEES"
        },
        {
          name: "Add Employee",
          value: "ADD_EMPLOYEE"
        },
        {
          name: "Remove Employee",
          value: "REMOVE_EMPLOYEE"
        },
        {
          name: "Update Employee Role",
          value: "UPDATE_EMPLOYEE_ROLE"
        },
        {
          name: "View Employees By Department",
          value: "VIEW_EMPLOYEESBYDEPARTMENT"
        },
        {
          name: "View Employees By Manager",
          value: "VIEWEMPLOYEESBYMANAGER"
        },
        {
          name: "Update Employee Manager",
          value: "UPDATEEMPLOYEEMANAGER"
        },
        {
          name: "View Roles",
          value: "VIEWROLES"
        },
        {
          name: "Add Role",
          value: "ADDROLE"
        },
        {
          name: "Remove Role",
          value: "REMOVEROLE"
        },
        {
          name: "Add Department",
          value: "ADDDEPARTMENT"
        },
        {
          name: "Remove Department",
          value: "REMOVEDEPARTMENT"
        },
        {
          name: "Quit",
          value: "QUIT"
        }
      ]
    }
  ]).then(answer => {
    console.log(answer)
    return(answer)
  });
  console.log(choice)
  // Call the appropriate function depending on what the user chose
  switch (choice) {
    case "VIEW_EMPLOYEES":
      return viewEmployees();
    case "ADD_EMPLOYEE":
      return addEmployee();
    case "REMOVE_EMPLOYEE":
      return removeEmployee();
    case "UPDATE_EMPLOYEE_ROLE":
      return updateEmployeeRole();
    case "VIEW_EMPLOYEESBYDEPARTMENT":
      return viewEmployeesByDepartment();
    case "VIDEEMPLOYEESBYMANAGER":
      return videEmployeesByManager();
    case "UPDATEEMPLOYEEMANAGER":
        return updateEmployeeManager();
    case "VIEWROLES":
        return viewRoles();
    case "ADDROLE":
        return addRole();
    case "REMOVEROLE":
      return removeRole();
    case "ADDDEPARTMENT":
      return addDepartment();
    case "REMOVEDEPARTMENT":
      return removeDepartment();

    default:
      return quit();
  }
}
//save
async function viewEmployees() {
  const employees = await db.findAllEmployees();

  console.log("\n");
  console.table(employees);

  loadMainPrompts();
}
//Create viewEmployeesByDepartment function
async function viewEmployeesByDepartment() {
  const department = await db.findAllDepartments();
  const departmentChoices = department.map(({ id, name }) => ({
    name: `${name}`,
    value: id
  
  }));

  const { departmentId } = await prompt([
    {
      type: "list",
      name: "departmentId",
      message: "Which department do you want to view?",
      choices: departmentChoices
    }
  ]);
  
  const employment = await db.findAllDepEmp(departmentId);

  console.log("\n");
  console.table(employment);

  loadMainPrompts();
}

//Create videEmployeesByManager function
async function videEmployeesByManager() {
  const Manager = await db.findAllManagers();
  const ManagerChoices = Manager.map(({ id, name }) => ({
    name: `${name}`,
    value: id
  
  }));

  const { managerId } = await prompt([
    {
      type: "list",
      name: "managerId",
      message: "Which manager do you want to view?",
      choices: ManagerChoices
    }
  ]);
  const employees = await db.findAllEmpManager(managerId);

  console.log("\n");
  console.table(employees);

  loadMainPrompts();
}

//save
async function removeEmployee() {
  const employees = await db.findAllEmployees();
  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee do you want to remove?",
      choices: employeeChoices
    }
  ]);

  await db.removeEmployee(employeeId);

  console.log("Removed employee from the database");

  loadMainPrompts();
}

//save
async function updateEmployeeRole() {
  const employees = await db.findAllEmployees();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee's role do you want to update?",
      choices: employeeChoices
    }
  ]);

  const roles = await db.findAllRoles();

  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { roleId } = await prompt([
    {
      type: "list",
      name: "roleId",
      message: "Which role do you want to assign the selected employee?",
      choices: roleChoices
    }
  ]);

  await db.updateEmployeeRole(employeeId, roleId);

  console.log("Updated employee's role");

  loadMainPrompts();
}

//Create updateEmployeeManager function
async function updateEmployeeManager() {
  const employees = await db.findAllEmployees();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee's manager do you want to update?",
      choices: employeeChoices
    }
  ]);

  const Manager = await db.findAllRoles();

  const managerChoices = Manager.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { managerId } = await prompt([
    {
      type: "list",
      name: "managerId",
      message: "Which manager do you want to assign the selected employee?",
      choices: managerChoices
    }
  ]);

  const updateEmployee = await db.updateEmployeeManager(employeeId);

  console.log("\n");
  console.table(employees);

  loadMainPrompts();
}

//Create viewRoles function
async function viewRoles() {
  const roles = await db.viewRoles();

  console.log("\n");
  console.table(roles);

  loadMainPrompts();
}

//Create addRole function
async function addRole() {
  const department = await db.findAllDepartments();
  const role = await prompt([
    {
      name: "name",
      message: "What is the name of the role?"
    }
  ]);
  const departmentChoices = department.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { departmentId } = await prompt({
    type: "list",
    name: "departmentId",
    message: "What is the department?",
    choices: departmentChoices
  });

  role.department_id = departmentId;
  const newRole = await db.addRole(role);
  console.log("\n");
  console.log("newrole created");

  loadMainPrompts();
}

//Create removeRole function
async function removeRole() {
  const roles = await db.findAllRoles();
  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { roleId } = await prompt({
    type: "list",
    name: "roleId",
    message: "Which role do you want to remove?",
    choices: roleChoices
  });

  const employees = await db.removeRole(roleId);

  console.log("\n");
  console.log("role removed");

  loadMainPrompts();
}

//Create addDepartment function
async function addDepartment() {
  const department = await prompt([
    {
      name: "name",
      message: "What is the department name?"
    }
  ]);
  const newdepartment = await db.addDepartment(department);

  console.log("\n");
  console.log("created department");

  loadMainPrompts();
}

//Create removeDepartment function
async function removeDepartment() {
  const department = await db.findAllDepartments();
  const departmentChoices = department.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { departmentId } = await prompt({
    type: "list",
    name: "departmentId",
    message: "Which department do you want to remove?",
    choices: departmentChoices
  });

  const employees = await db.removeDepartment(departmentId);

  console.log("\n");
  console.log("department removed");

  loadMainPrompts();
}

//save
async function addEmployee() {
  const roles = await db.findAllRoles();
  const employees = await db.findAllEmployees();

  const employee = await prompt([
    {
      name: "first_name",
      message: "What is the employee's first name?"
    },
    {
      name: "last_name",
      message: "What is the employee's last name?"
    }
  ]);

  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { roleId } = await prompt({
    type: "list",
    name: "roleId",
    message: "What is the employee's role?",
    choices: roleChoices
  });

  employee.role_id = roleId;

  const managerChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));
  managerChoices.unshift({ name: "None", value: null });

  const { managerId } = await prompt({
    type: "list",
    name: "managerId",
    message: "Who is the employee's manager?",
    choices: managerChoices
  });

  employee.manager_id = managerId;

  await db.createEmployee(employee);

  console.log(
    `Added ${employee.first_name} ${employee.last_name} to the database`
  );

  loadMainPrompts();
}

function quit() {
  console.log("Goodbye!");
  process.exit();
}
