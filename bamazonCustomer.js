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

connection.connect(function(err) {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId);
});

readProducts();

function readProducts() {
  console.log('Selecting all products...\n');

  connection.query('SELECT * FROM products', function(err, res, fields) {
    if (err) throw err;
    // Log all results of the SELECT statement

    console.log(res.length);
    console.table(res);

    start();
  });
}

// CUSTOMER BUYING ITEMS

function start() {
  inquirer
    .prompt([
      {
        name: 'Item',
        type: 'rawlist',
        message: 'Please choose item ID# for the item you like to buy?',
        choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      },
      {
        name: 'Amount',
        type: 'input',
        message: 'How many would you like?',
        validate: function(value) {
          if (isNaN(value) == false) {
            return true;
          } else {
            return false;
          }
        }
      }
    ])
    .then(function(answer) {
      if (answer.Item === 2) {
        console.log('You chose 2');
        console.log(answer.Item);
      } else {
        console.log('Choose another number');
      }

      connection.end();
    });
}
