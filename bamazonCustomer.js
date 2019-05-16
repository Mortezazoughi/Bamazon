var inquirer = require('inquirer');
var mysql = require('mysql');

// Creating connection

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '7godiva7',
  database: 'bamazon'
});

connection.connect(function(err) {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId);

  readProducts();
});

function readProducts() {
  console.log('Selecting all products...\n');
  connection.query('SELECT * FROM products', function(err, res, fields) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log(res.length);
    console.log(
      `|Product Name         | Department Name      | Price    | Stock Quantity   | Product Sale |`
    );

    console.log(
      `___________________________________________________________________________________________`
    );
    console.log(` `);

    console.log(
      `| ${res[0].product_name}          |  ${
        res[0].department_name
      }            | $${res[0].price}   |   ${
        res[0].stock_quantity
      }            |  $${res[0].product_sale}           `
    );
    console.log(
      `| ${res[1].product_name}              |  ${
        res[1].department_name
      }            | $${res[1].price}   |   ${
        res[1].stock_quantity
      }            |  $${res[1].product_sale}            `
    );
    console.log(
      `| ${res[2].product_name}           |  ${
        res[2].department_name
      }            | $${res[2].price}  |   ${
        res[2].stock_quantity
      }             |  $${res[2].product_sale}           `
    );
    console.log(
      `| ${res[3].product_name}         |  ${
        res[3].department_name
      }            | $${res[3].price}   |   ${
        res[3].stock_quantity
      }             |  $${res[3].product_sale}            `
    );
    console.log(
      `| ${res[4].product_name}           |  ${
        res[4].department_name
      }            | $${res[4].price}   |   ${
        res[4].stock_quantity
      }            |  $${res[4].product_sale}            `
    );
    console.log(
      `| ${res[5].product_name}      |  ${
        res[5].department_name
      }            | $${res[5].price}  |   ${
        res[5].stock_quantity
      }             |  $${res[5].product_sale}            `
    );
    console.log(
      `| ${res[6].product_name}                |  ${
        res[6].department_name
      }              | $${res[6].price}  |   ${
        res[6].stock_quantity
      }             |  $${res[6].product_sale}            `
    );
    console.log(
      `| ${res[7].product_name}               |  ${
        res[7].department_name
      }              | $${res[7].price}   |   ${
        res[7].stock_quantity
      }             |  $${res[7].product_sale}           `
    );
    console.log(
      `| ${res[8].product_name}            |  ${
        res[8].department_name
      }              | $${res[8].price}    |   ${
        res[8].stock_quantity
      }            |  $${res[8].product_sale} `
    );
    console.log(
      `| ${res[9].product_name}                  |  ${
        res[9].department_name
      }         | $${res[9].price}  |   ${
        res[9].stock_quantity
      }             |  $${res[9].product_sale} `
    );

    connection.end();
  });
}
