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

departUpdate();

function departUpdate() {
  connection.query('SELECT * FROM departments', function(err, res) {
    if (err) throw err;
    TableNew = res;
    console.table(TableNew);
  });
}

allData();

function allData() {
  connection.query('SELECT * FROM products', function(err, res) {
    if (err) throw err;
    Table = res;
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
      // console.log(choiceArr);
      // console.log(`\n   \n  `);
      // console.log(Table);
      console.log(`\n  \n `);
      console.table(productData);

      shopping();
    }
  );
}

// CUSTOMER BUYING ITEMS

function shopping() {
  inquirer
    .prompt([
      {
        name: 'Item',
        type: 'list',
        choices: function() {
          itemIdArr = [];
          for (var i = 0; i < choiceArr; i++) {
            itemId = Table[i].item_id;
            prodName = Table[i].product_name;
            prodIndex = `${itemId}- ${prodName}`;
            itemIdArr.push(prodIndex);
          }
          return itemIdArr;
        },

        message: 'Please choose ID# of item you like to purchase?'
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
      str = answer.Item;
      id = parseInt(str.charAt(0) + str.charAt(1)) - 1;
      // id = answer.Item - 1;
      number = answer.Amount;
      // console.log(id);
      // console.log(itemIdArr);

      // console.log(Table[id].stock_quantity);
      if (Table[id].stock_quantity < number) {
        // console.log(Table[id].stock_quantity);
        console.log(
          `\nInsufficient quntity. Total quantity of ${
            productData[id].product_name
          }(s) on hand is ${Table[id].stock_quantity}. \nPlease try again.\n `
        );
        setTimeout(function() {
          shopping;
        }, 3000);
      } else {
        totalPurchase = number * productData[id].price.toFixed(2);
        console.log(
          `\nyour total purchase of ${number} ${
            productData[id].product_name
          }(s) is $${totalPurchase.toFixed(2)}`
        );

        totalSale =
          parseFloat(Table[id].product_sale) + parseFloat(totalPurchase);
        // console.log(totalSale.toFixed(2));

        quantityUpdate = Table[id].stock_quantity - number;
        // console.log(quantityUpdate);
        // console.log('$' + totalPurchase.toFixed(2));

        // console.log(choiceArr);
        // console.log(Table[id].stock_quantity);
        // console.log(productData[id].product_name);
        // console.log(answer.Amount);

        query = connection.query(
          'UPDATE products SET ?,? WHERE ?',
          [
            { stock_quantity: quantityUpdate },
            { product_sale: totalSale },
            { item_id: Table[id].item_id }
          ],
          function(err, res) {
            if (err) throw err;
            console.log(
              `\nThank you for purchasing ${productData[id].product_name}. \n `
            );
          }
        );
      }
      setTimeout(function() {
        shopMore();
      }, 2000);
    });

  // ALLOWING THE CUSTOMER TO PURCHASE OTHER ITEMS OR EXIT

  function shopMore() {
    inquirer
      .prompt({
        //ALLOWING TO PURCHASE ADDITIONAL ITEMS
        name: 'buyMore',
        type: 'confirm',
        message: 'Would you like to purchase additional items?',
        default: true
        // validate: function(value) {
        //   if (this.buyMore == 'y' || this.buyMore == 'n') {
        //     return true;
        //   } else {
        //     return false;
        //   }
        // }
      })
      .then(function(answer) {
        if (answer.buyMore == true) {
          console.log(`\n `);
          shopping();
        } else {
          console.log(
            `\nThank you for shopping with us today. \n Have a great day.`
          );
          connection.end();
        }
      });
  }
}
