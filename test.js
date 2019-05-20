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

display();

function display() {
  connection.query('SELECT * FROM products', function(err, res) {
    if (err) throw err;
    dataArr = res.length;
    console.log(dataArr);
    info = res;
    console.log(info);
    console.log('---------------------------------');
    console.log('       Welcome to Bamazon       ');
    console.log('---------------------------------');
    console.log('');
    console.log('Find your products below');
    console.log('');

    gettingInfo();
  });
}

function gettingInfo() {
  for (var i = 0; i < dataArr; i++) {
    table.push([
      info[i].item_id,
      info[i].product_name,
      info[i].department_name,
      info[i].price
    ]);
  }
  console.log(table.toString());
  console.log('');
}

var table = new Table({
  head: ['Product Id', 'Product Description', 'Department', 'Cost'],
  colWidths: [12, 50, 20, 8],
  colAligns: ['center', 'left', 'left', 'right'],
  style: {
    head: ['aqua'],
    compact: true
  }
});
