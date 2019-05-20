require('dotenv').config();
var {
  env: { DB_HOST, DB_USER, DB_PASSWORD }
} = process;

var inquirer = require('inquirer');
var mysql = require('mysql');

// Creating connection

var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'bamazon'
});

// CHECKING CONNECTION

connection.connect(function(err) {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId);
  // storeSupervisor()
  storeSup();
});

function storeSup() {
  //GETTING SUPERVISOR'S INPUT
  inquirer
    .prompt([
      {
        name: 'SupList',
        type: 'list',
        message: 'Welcome, what task would you like to perform today?',
        choices: ['View Product Sales by Department', 'Create New Department']
      }
    ])
    .then(function(resp) {
      switch (resp.SupList) {
        case 'View Product Sales by Department':
          console.log(`\n   * View Product Sales by Department\n  `);

          // setTimeout(function() {
          //   viewProdSale();
          // }, 500);
          tableJoin();
          break;

        case 'Create New Department':
          console.log(`\n   * Create New Department \n  `);
          setTimeout(function() {
            addDepartment();
          }, 500);

          break;
      }
    });
}

function tableJoin() {
  connection.query(
    'SELECT * FROM departments LEFT JOIN products ON departments.department_name=products.department_name',
    function(err, res) {
      if (err) throw err;
      NEWTABLE = res;
      console.table(NEWTABLE);
      console.log(NEWTABLE[4].product_name);
      tempColumn();
    }
  );
}

function tempColumn() {
  connection.query(
    'SELECT department_id, department_name, over_head_costs,product_sale AS total_profit FROM departments',
    function(err, res) {
      if (err) throw err;
      checkTable = res;
      console.log(checkTable);
    }
  );
}

function viewProdSale() {
  // strSQL =
  //   'SELECT B. department_id, A.department_name, b.over_head_costs, sum(A.product sales) AS Total Sales_By_Dept,';
  // strSQL +=
  //   'sum(A.product_sales) - B.over_head_costs AS Profit from products A, departments B ';
  // strSQL +=
  //   'WHERE a.department_name = b.department_name Group BY department_name ORDER BY department_id ';
  connection.query(strSQL, function(err, res) {
    if (err) throw err;
    table = [];
    // supTable = res;
    // SupInfo = res.length;
    // console.log(supInfo);
    // console.log(supTable);

    // DSPLAYING LOW INVENTORY ITEMS
    for (var i = 0; i < res.length; i++) {
      table.push([
        res[i].department_id,
        res[i].department_name,
        res[i].over_head_costs,
        res[i].Total_Sales_By_Dept,
        res[i].Profit
      ]);
    }
    console.log(table.toString());

    Return();
  });
}

function addDepartment() {
  inquirer
    .prompt([
      /* Pass your questions in here */
      {
        name: 'newDept',
        type: 'input',
        message: 'What department would you like to add?',
        validate: function(value) {
          if (value == null || value == '') {
            return false;
          } else {
            return true;
          }
        }
      },
      {
        name: 'overheadCost',
        type: 'input',
        message: 'Please enter new department overhead cost.',
        validate: function(value) {
          if (isNaN(value) == false) {
            return true;
          } else {
            return false;
          }
        }
      }
    ])
    .then(function(answers) {
      connection.query(
        'INSERT INTO departments SET ?',
        {
          over_head_costs: answers.overheadCost,
          department_name: answers.newDept
        },
        function(err, res) {
          if (err) throw err;
          console.log(
            `--------------------------------------------------------`
          );
          console.log(
            `\n      ******** NEW DEPARTMENT HAS BEEN ADDED ********\n`
          );
          console.log(
            `--------------------------------------------------------`
          );
          // console.log(
          //   res.affectedRows + ' NEW row affected. Department inserted!\n'
          // );

          Return();
        }
      );
    });
}

function Return() {
  inquirer
    .prompt({
      //ALLOWING SUPERVISOR TO PERFORM OTHER TASKS
      name: 'manage',
      type: 'confirm',
      message: 'Would you like to perform any other tasks?',
      default: true
    })
    .then(function(answer) {
      if (answer.manage == true) {
        storeSup();
      } else {
        console.log(`--------------------------------------------------------`);
        console.log(`\n      ******** HAVE A GREAT DAY ********\n`);
        console.log(`--------------------------------------------------------`);
        connection.end();
      }
    });
}
