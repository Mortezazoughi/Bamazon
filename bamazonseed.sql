
-- CLEARING ANY EXISTING DATABASE --

DROP DATABASE IF EXISTS bamazon;

-- Creating bamazon database --

CREATE DATABASE bamazon;
USE bamazon;

-- CREATING TABLE PRODUCTS WITH COLUMNS--
-- ADDING COLUMNS FOR DATE AND TIMESTAMP WHEN CREATED AND UPDATED--
CREATE TABLE products (
  item_id INTEGER(11) AUTO_INCREMENT NOT NULL,

   product_name VARCHAR(50) NOT NULL,

   department_name VARCHAR(50) NOT NULL,

   price DECIMAL(10,2) NULL,

  stock_quantity INT NULL,

  product_sale DECIMAL(10,2) NULL,

  PRIMARY KEY (item_id),

  Created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  
);

-- ADDING VALUES TO TABLE

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sale)
VALUES ("Hard Drive", "Hardware", 49.95, 100, 0);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sale)
VALUES ("Memory", "Hardware", 89.95, 250, 0);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sale)
VALUES ("processor", "Hardware", 299.95, 60, 0);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sale)
VALUES ("Cloud Suite", "Software", 29.95, 30, 0);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sale)
VALUES ("Tax Suite", "Software", 69.95, 150, 0);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sale)
VALUES ("Graphic Design", "Software", 149.95, 20, 0);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sale)
VALUES ("Desk", "Office", 649.95, 10, 0);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sale)
VALUES ("Chair", "Office", 99.95, 15, 0);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sale)
VALUES ("Calendar", "Office", 9.95, 100, 0);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sale)
VALUES ("TV", "Electronics", 699.95, 18, 0);


-- CREATING SECOND TABLE WITH TIMESTAMP--


CREATE TABLE departments (
  department_id INTEGER(11) AUTO_INCREMENT NOT NULL,

  department_name VARCHAR(100) NOT NULL,

  over_head_costs DECIMAL(10,2) NULL,

  product_sale DECIMAL(10,2) NULL,

  PRIMARY KEY (department_id),
  Created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
  
);

-- ADDING VALUES TO TABLE --

INSERT INTO departments (department_name, over_head_costs,product_sale)
VALUES ("Hardware", 75000,0);
INSERT INTO departments (department_name, over_head_costs,product_sale)
VALUES ("Software", 100000,0);
INSERT INTO departments (department_name, over_head_costs,product_sale)
VALUES ("Office", 12000,0);
