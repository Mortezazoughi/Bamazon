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
});

// QUERY TABLE FROM DATABASE

allData();

function allData() {
  connection.query('SELECT * FROM products', function(err, res) {
    if (err) throw err;
    Table = res;

    itemData = res.length;

    // console.table(Table);
    storeManagement();
  });
}

function storeManagement() {
  inquirer
    .prompt({
      default: true,
      name: 'toDoItems',
      type: 'list',
      choices: [
        'View Products for Sale',
        'View Low Inventory',
        'Update Inventory',
        'Add New Product'
      ],
      message: 'Please choose one of the items from the list'
    })
    .then(function(answer) {
      todoOptions = answer.toDoItems;

      // CHECKING FOR SELECTIONS

      switch (todoOptions) {
        case 'View Products for Sale':
          viewInventory();
          console.log(`\n   * View Products for Sale`);
          break;

        case 'View Low Inventory':
          console.log(`\n   * View Low Inventory`);
          setTimeout(function() {
            viewLowInv();
          }, 1000);
          break;

        case 'Update Inventory':
          console.log(`\n   * Add to Inventory`);
          setTimeout(function() {
            addToInv();
          }, 1000);
          break;

        case 'Add New Product':
          console.log(`     * Add New Product `);
          setTimeout(function() {
            addItems();
          }, 1000);
          break;
      }
    });
}

function viewInventory() {
  // DISPLAYING THE INVENTORY TO MANAGER

  setTimeout(function() {
    console.table(Table);
  }, 500);
  setTimeout(function() {
    Return();
  }, 1000);
}

function viewLowInv() {
  // DISPLAYING ITEMS WITH INVENTORY OF LESS THAN 5

  connection.query('SELECT * FROM products WHERE stock_quantity < 5', function(
    err,
    res
  ) {
    if (err) throw err;

    // CHECKING WHETHER ANY ITEM IS LESS THAN 5 UNITS

    if (res.length == 0) {
      console.log(
        `------------------------------------------------------------------`
      );
      console.log(
        `\n  ******** All items have an inventory above five units ********`
      );
      console.log(
        `------------------------------------------------------------------`
      );
      setTimeout(function() {
        Return();
      }, 500);
    } else {
      console.table(res);
      setTimeout(function() {
        Return();
      }, 500);
    }
  });
}

function addToInv() {
  // ALLOWING MANAGER TO ADD TO INVENTORY
  inquirer
    .prompt([
      {
        name: 'Item',
        type: 'list',
        choices: function() {
          itemIdArr = [];
          for (var i = 0; i < itemData; i++) {
            itemId = Table[i].item_id;
            prodName = Table[i].product_name;
            prodIndex = `${itemId}- ${prodName}`;
            itemIdArr.push(prodIndex);
          }

          return itemIdArr;
        },

        message: 'Please choose the item you like to update the inventory'
      },
      {
        name: 'InvUpdate',
        type: 'input',
        message: `Please enter new item inventory.`,
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
      // console.log('we are updating inventory');
      // console.log(answer.Item);
      // console.log(answer.InvUpdate);
      str = answer.Item;
      strNum = parseInt(str.charAt(0));
      // console.log(strNum);
      connection.query('UPDATE products SET ? WHERE ?', [
        {
          stock_quantity: answer.InvUpdate
        },

        {
          item_id: strNum
        }
      ]);
      console.log(`--------------------------------------------------------`);
      console.log(`\n      ******** INVENTORY HAS BEEN UPDATED ********\n`);
      console.log(`--------------------------------------------------------`);
      setTimeout(function() {
        Return();
      }, 500);
    });
}

function addItems() {
  inquirer
    .prompt([
      {
        name: 'NewItem',
        type: 'input',

        message: 'Please enter item name.',
        validate: function(value) {
          if (value == null || value == '') {
            return false;
          } else {
            return true;
          }
        }
      },
      {
        name: 'Department',
        type: 'input',
        message: 'Please enter department name for the item.',
        validate: function(value) {
          if (value == null || value == '') {
            return false;
          } else {
            return true;
          }
        }
      },
      {
        name: 'Price',
        type: 'input',
        message: 'Please enter the item price.',
        validate: function(value) {
          if (isNaN(value) == false) {
            return true;
          } else return true;
        }
      },
      {
        name: 'Quantity',
        type: 'input',
        message: 'Please enter the number of item on hand for inventory.',
        validate: function(value) {
          if (isNaN(value) == false) {
            return true;
          } else return true;
        }
      },
      {
        name: 'productSales',
        type: 'input',
        message: 'Please enter the total product sale to date.',
        validate: function(value) {
          if (isNaN(value) == false) {
            return true;
          } else return true;
        }
      }
    ])
    .then(function(answer) {
      var query = connection.query(
        'INSERT INTO products SET ?',
        {
          product_name: answer.NewItem,
          department_name: answer.Department,
          price: answer.Price,
          stock_quantity: answer.Quantity,
          product_sale: answer.productSales
        },
        function(err, res) {
          if (err) throw err;
          Str2 = answer.NewItem;
          (StrUpper = Str2.toUpperCase()),
            console.log(
              `--------------------------------------------------------`
            );
          console.log(`\n      ******** ${StrUpper} HAS BEEN ADDED ********\n`);
          console.log(
            `--------------------------------------------------------`
          );
          setTimeout(function() {
            Return();
          }, 500);
        }
      );
    });
}

// ALLOWING THE CUSTOMER TO PURCHASE OTHER ITEMS OR EXIT

function Return() {
  inquirer
    .prompt({
      //ALLOWING MANAGER TO PERFORM OTHER TASKS
      name: 'otherTasks',
      type: 'confirm',
      message: 'Would you like to perform additional tasks?',
      default: true
    })
    .then(function(answer) {
      if (answer.otherTasks == true) {
        console.log(`\n `);
        storeManagement();
      } else {
        console.log(`--------------------------------------------------------`);
        console.log(`\n      ******** HAVE A GREAT DAY ********\n`);
        console.log(`--------------------------------------------------------`);
        connection.end();
      }
    });
}
