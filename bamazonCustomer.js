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

allData();

function allData() {
  connection.query('SELECT * FROM products', function(err, res) {
    if (err) throw err;
    Table = res;
    console.log(Table);
  });
}

readProducts();

function readProducts() {
  connection.query(
    'SELECT item_id, product_name, price FROM products',
    function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement

      choiceArr = res.length;
      productData = res;
      console.log(choiceArr);
      console.table(productData);

      start();
    }
  );
}

// CUSTOMER BUYING ITEMS

function start() {
  inquirer
    .prompt([
      {
        name: 'Item',
        type: 'list',
        choices: function() {
          itemIdArr = [];
          for (var i = 1; i < choiceArr + 1; i++) {
            itemIdArr.push(i);
          }
          return itemIdArr;
        },
        message: 'Please choose item ID# for the item you like to buy?'
      },
      {
        name: 'Amount',
        type: 'input',
        message: `How many would you like?`,
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
      id = answer.Item;
      number = answer.Amount;
      if (Table[id].stock_quantity > number) {
        totalPurchase = number * productData[id].price.toFixed(2);
        console.log(
          `your total purchase of ${number} ${
            productData[id].product_name
          }(s) is $${totalPurchase.toFixed(2)}`
        );
        // console.log('$' + totalPurchase.toFixed(2));

        console.log(choiceArr);
        console.log(productData[id].product_name);
        console.log(answer.Amount);
      } else {
        console.log(productData[id].product_name);
        console.log(Table[id].stock_quantity);
        console.log('Choose another number');
      }

      connection.end();
    });
}
