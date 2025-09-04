---
Source:
  - https://www.w3schools.com/sql/default.asp
Length: "77"
tags:
  - status/incomplete
  - type/website
Reviewed: false
---
## SQL Tutorial
### SQL HOME
- [[SQL]] is a standard language for storing, manipulating, and retrieving data in databases
- Will be taught how to use SQL in
	- [[MySQL]]
	- [[SQL Server]]
	- [[MS Access]]
	- [[Oracle]]
	- [[Sybase]]
	- [[Informix]]
	- [[Postgres]]
	- and other database systems
		- #question Are all these database systems?
### SQL Intro
- [[SQL]]
	- Stands for Structured Query Language
	- Lets you access and manipulate databases
	- Became a standard of the American National Standards Institute (ANSI) in 1986 and of the International Organization for Standardization (ISO) in 1987
- Functions of SQL
	- execute queries against a database
	- retrieve data from a database
	- insert records in a database
	- update records in a database
	- delete records from a database
	- create new databases
	- create new tables in a database
	- create stored procedures in a database
	- create views in a database
	- set permissions on tables, procedures, and views
- There are different versions of the SQL language
	- But to be compliant with ANSI standard, they all support at least major commands
		- `SELECT, UPDATE, DELETE, INSERT, WHERE` similarly
	- Most SQL database programs have their own proprietary extensions in addition to the SQL standard
- Building website to show data from a database
	- An [[relational database|RDBMS]] database program (i.e. [[MS Access]], [[SQL Server]], [[MySQL]])
		- #question Is it correct to say "database program" again?
	- To use a server-side scripting language, [[PHP]] or [[ASP]]
- [[relational database|RDBMS]]
	- Stands for relational database management system
	- Basis for SQL, and for all modern database systems such as [[MS SQL Server]], [[IBM DB2]], [[Oracle]], [[MySQL]], and [[Microsoft Access]]
	- Data in [[relational database|RDBMS]] is stored in database objects called tables
		- A [[table]] is a collection of related data entries and it consists of columns and rows
- Example (This is the "customers" table)
```SQL
SELECT * FROM Customers;
```
- Output
	- ![[Screenshot 2025-01-25 at 12.41.05 AM.png]]
- Every [[table (SQL)|table]] is broken up into smaller entities called [[field (SQL)|fields]]. 
	- The fields of this Customers table:
		- `CustomerID`
		- `CustomerName`
		- `ContactName`
		- `Address`
		- `City`
		- `PostalCode`
		- `Country`
	- A [[field (SQL)|field]] is a column in a table that is designed to maintain specific information about every [[record (SQL)|record]] in the table
- A [[record (SQL)|record]], also called a row, is each individual entry that exists in a table. For example, there are 91 records in the above Customers table. A record is a horizontal entity in a table
- A [[column (SQL)|column]] is a vertical entity in a table that contains all information associated with a specific field in a table
### SQL Syntax
- SQL Statements
	- Most actions needed to perform on a database are done with SQL statements
	- SQL statements consist of keywords that are easy to understand
	- Below is an SQL statement that returns all records from a table named "Customers"
		- `SELECT * FROM Customers;`
		- ![[Screenshot 2025-02-06 at 9.37.03 AM.png]]
- Database Tables
	- A database most often contains one or more tables
	- Each table is identified by a name (e.g. "Customers" or "Orders"), and contain records (rows) with data
	- Will use the well-known Northwind sample database (included in [[MS Access]] and [[MS SQL Server]])
- Below is a selection from the Customers table used in examples
	- ![[Screenshot 2025-02-06 at 9.40.11 AM.png]]
		- Contains five records (one for each customer)
		- Seven columns
- SQL keywords not case sensitive
	- `select` =  `SELECT`
- Some database systems require a semicolon at the end of each SQL statement
	- Semicolons are the standard way to separate each SQL statement in database systems that allow more than one SQL statement to be executed in the same call to the server
- Important SQL Commands
	- `SELECT` - extracts data from a database
	- `UPDATE` - updates data in a database
	- `DELETE` - deletes data from a database
	- `INSERT INTO` - inserts new data into a database
	- `CREATE DATABASE` - creates a new database
	- `ALTER DATABASE` - modifies a database
	- `CREATE TABLE` - creates a new table
	- `ALTER TABLE` - modifies a table
	- `DROP TABLE` - deletes a table
	- `CREATE INDEX` - creates an index (search key)
	- `DROP INDEX` - deletes an index
#### Quiz
- Which SQL statement is used to select all records from a table named `Customers`?
	- `SELECT * FROM Customers`
- What is a [[table]] in a database?
	- A structured set of data organized in rows and columns
- Are SQL keywords case-sensitive?
	- No
- Why is a semicolon used at the end of SQL statements?
	- To separate multiple SQL statements
### SQL Select
- `SELECT` statement is used to select data from a database
- Return data from the Customers table:
	- `SELECT CustomerName,City FROM Customers;`
	- ![[Screenshot 2025-02-06 at 9.53.56 AM.png]]
- Syntax
```SQL
SELECT column1, column2 ...
FROM table_name;
```
- Column1, column2 are the field names of the table you want to select data from
- The `table_name` represents the name of the table you want to select data from
- Can represent all columns from the Customers table
	- `SELECT * FROM Customers;`
#### Exercises
- What is the purpose of the SQL SELECT statement?
	- To select data from a database
- Get all columns from Customers table
	- `SELECT * FROM Customers;`
- Statement selecting `City` column from `Customers` table
	- `SELECT City FROM Customers`
- Selecting `CustomerName` and `City` columns from a table named `Customers`
	- SELECT CustomerName, City FROM Customers;
- Select all columns from a table named `Customers`
	- `SELECT * FROM Customers`
### SQL Select Distinct
- `SELECT DISTINCT` statement is used to return only distinct (different) values
- Selecting all different countries from `Customers` table
	- `SELECT DISTINCT Country FROM Customers;`
	- ![[Screenshot 2025-02-06 at 10.03.52 AM.png]]
		- Just lists all the distinct countries from the table
- In a table, a column may contain duplicate values and you only want to list the distinct values
- Syntax
```SQL
SELECT DISTINCT column1, column2, ...
FROM table_name;
```
- Omitting distinct will return "Country" value from all the records of the `Customers` table
	- `SELECT country FROM Customers;`
	- ![[Screenshot 2025-02-06 at 10.04.24 AM.png]]
		- Gives all records of table just the name of the countries (but doesn't seem to show the record paired with it)
- Count Distinct
	- Return the number of different countries
		- `SELECT COUNT(DISTINCT Country) FROM Customers;`
			- The `COUNT(DISTINCT column_name)` is not supported in [[Microsoft Access]] databases
			- #question is the return just a number?
- Workaround for Count Distinct for Microsoft Access
```SQL
SELECT Count(*) AS DistinctCountries
FROM (SELECT DISTINCT Country FROM Customers);
```
- This would 
	- ![[Screenshot 2025-02-06 at 10.08.44 AM.png]]
#### Exercises
- Return list of all unique countries from a table named `Customers`?
	- SELECT DISTINCT Country FROM Customers;
- Select different values from `Country` column in the `Customers` table
	- SELECT DISTINCT Country FROM Customers;
- What does `SELECT Country FROM Customers` do?
	- It would return all values, including duplicates, in the Country column
- What does `SELECT COUNT(DISTINCT Country) FROM Customers;` do?
	- Returns the number of different countries in the Customers table
- When would you use `DISTINCT` more likely?
	- To return unique values from a column that contains duplicates
### SQL Where
- `WHERE` clause is used to filter records
	- Used to extract only records that fulfill a specified condition
- Selecting all customers from Mexico
```SQL
SELECT * FROM Customers
WHERE Country='Mexico';
```
- Returned
	- ![[Screenshot 2025-02-06 at 10.16.09 AM.png]]
		- All of them have the cit `Mexico` column
- Syntax
```SQL
SELECT column1, column2, ...
FROM table_name
WHERE condition;
```
- `WHERE` can be used in other statement aside from `SELECT` such as `UPDATE`, `DELETE`, etc.
- Text Field vs Numeric Field
	- SQL requires single quotes around text values (most database systems will also allow double quotes)
	- However, numeric fields should not be enclosed in quotes
- Example
```SQL
SELECT * FROM Customers
WHERE CustomerID=1;
```
- Result
	- ![[Screenshot 2025-02-06 at 10.18.33 AM.png]]
- Operators in `WHERE` Clause
	- You can use other operators than the = operator to filter the search
- Example
```SQL
SELECT * FROM Customers
WHERE CustomerID > 80;
```
- Would return 11 records where `CustomerID > 80`
- Operators
	- =
		- `WHERE CustomerID = 80;`
			- Returns records with CustomerID = 80
	- >
	- <
	- >=
	- <=
	- <>
		- Not equal. Note: In some versions of SQL this operator may be written as !=
		- `WHERE Price <> 18;`
			- Will not return a record where the price = 18
	- BETWEEN
		- Between a certain range
		- `WHERE Price BETWEEN 50 AND 60;`
			- Returns a record where the price is between 50 and 60
	- LIKE
		- Search for a pattern
		- `WHERE City LIKE 's%'`
			- This just means find any City that starts with "s"
	- IN
		- To specify multiple possible values for a column
		- `WHERE City IN ('Paris','London');`
			- Returns the records with `London` and `Paris` in them
#### Exercises
- What is the purpose of the SQL WHERE clause?
	- To filter records that meet a specified condition
- Which of the following SQL statements would return all customers from 'Mexico'?
	- SELECT * FROM Customers WHERE Country='Mexico';
- Select all records where the City column has the value "Berlin".
	- `SELECT * FROM Customers`
	- `WHERE City = 'Berlin';`
- Select all records where the CustomerID column has the value 32.
	- `SELECT * FROM Customers`
	- `WHERE CustomerID = 32;`
- How should text values be enclosed in the SQL WHERE clause?
	- With Single Quotes
		- #question Would double quotes work?
- Drag and drop to select all customers with a CustomerID greater than 50.
	-  `SELECT * FROM Customers`
	- `WHERE CustomerID > 50;`

### SQL Order By
- `ORDER BY` keyword is used to sort the result-set in ascending or descending order
- Example
```SQL
SELECT * FROM Products
ORDER BY Price;
```
- This will sort the records in ascending order (from lowest to highest) in terms of `Price`
Syntax
```SQL
SELECT column1, column2, ...
FROM table_name
ORDER BY column1, column2, ... ASC|DESC;
```
- DESC
	- The `ORDER BY` keyword sorts the records in ascending order by default. To sort the records in descending order, use the DESC keyword
- Example
```SQL
SELECT * FROM Products
ORDER BY Price DESC;
```
- Above will sort highest to lowest
```SQL
SELECT * FROM Products
ORDER BY ProductName;
```
- For string values, the `ORDER BY` keyword will order alphabetically
	- Using `ORDER BY ProductName DESC;` will sort products in reverse order
#### ORDER BY Several Columns
```SQL
SELECT * FROM Customers
ORDER BY Country, CustomerName;
```
- Orders by Country and if some rows have the same country, it will order them based on CustomerName
```SQL
SELECT * FROM Customers
ORDER BY Country ASC, CustomerName DESC;
```
- Sorts country by ascending order and then sorts `CustomerName` in descending order if 2 records have the same country name

#### Exercises
- What is the purpose of the SQL ORDER BY keyword?
	- To sort records in ascending or descending order
- Which SQL statement sorts products from highest to lowest price?
	- SELECT * FROM Products ORDER BY Price DESC;
- Select all records from the Customers table, sort the result alphabetically by the column City.
	- `SELECT * FROM Customers`
	- `ORDER BY City;`
- Select all records from the `Customers` table, sort the result _reversed_ alphabetically by the column `City`.
	-  `SELECT * FROM Customers`
	- `ORDER BY City DESC;
- Select all records from the `Customers` table, sort the result alphabetically, first by the column `Country`, then, by the column `City`.
	-  `SELECT * FROM Customers`
	- `ORDER BY County, City;
- In the SQL `ORDER BY` clause, what is the default sorting order if `ASC` or `DESC` is not specified?
	- Ascending
### SQL And
- `WHERE` clause can contain one or many [[AND (SQL)|AND]] operators
- `AND` operator used to filter records based on more than one condition, like if you want to return all customers from Spain that starts with the letter `G`
```SQL
SELECT *
FROM Customers
WHERE Country = 'Spain' AND CustomerName LIKE 'G%';
```
- Select all customers from Spain that starts with the letter 'G':
Syntax
```SQL
SELECT column1, column2, ...
FROM table_name
WHERE condition1 AND condition2 AND condition3 ...;
```
- #comment seems like `SELECT` and `FROM` can start on different lines
- And Operator
	- Displays a record if all the conditions are true
- Or Operator
	- Displays a record if any of the conditions are true
```SQL
SELECT * FROM Customers
WHERE Country = 'Germany'
AND City = 'Berlin'
AND PostalCode > 12000;
```
- Returns records where Country is Germany, City is Berlin, and PostalCode > 12000
```SQL
SELECT * FROM Customers
WHERE Country = 'Spain' AND (CustomerName LIKE 'G%' OR CustomerName LIKE 'R%');
```
- Can combine `AND` and `OR` operators ^sy1rb1
	- Here, we select customers from Spain that starts with either `G` or `R`
	- Without parenthesis
		- Will select customers from Spain that Start with G + Customers that star with R (regardless of country value)

#### Exercises
- (1) Which SQL keyword is used to filter records based on multiple conditions?
	- AND
- (2) What will this SQL query return?
```SQL
SELECT * FROM Customers
WHERE Country = 'Spain'
AND CustomerName LIKE 'G%';
```
- All customers from Spain whose names start with 'G'
- (3) What result will this query return?
```SQL
SELECT * FROM Customers
WHERE Country = 'Germany'
AND City = 'Berlin' AND PostalCode > 12000;
```
- Customers from Germany in Berlin with a PostalCode over 12000
![[Screenshot 2025-02-09 at 2.39.50 PM.png]]
### SQL Or
- `WHERE` clause can contain one or more `OR` operators
```SQL
SELECT *
FROM Customers
WHERE Country = 'Germany' OR Country = 'Spain';
```
 - `OR` operator is used to filter records based on more than one condition, like if you want to return all customers from Germany but also those from Spain
Syntax
```SQL
SELECT column1, column2, ...
FROM table_name
WHERE condition1 OR condition2 OR condition3 ...;
```
- The `OR` operator displays a record if _any_ of the conditions are TRUE.
```SQL
SELECT * FROM Customers
WHERE City = 'Berlin' OR CustomerName LIKE 'G%' OR Country = 'Norway';
```
- At least one condition must be true
	- City is Berlin, CustomerName starts with G, or Country is Norway
- Can combine "AND" and OR (found [[(Home Page) SQL Tutorial by W3Schools#^sy1rb1|here]] )

#### Exercises
![[Screenshot 2025-02-09 at 2.45.40 PM.png]]

### SQL Not
- The [[NOT (SQL)|NOT]] operator is used in combination with other operators to give the opposite result, also called the negative result.
```SQL
SELECT * FROM Customers
WHERE NOT Country = 'Spain';
```
- Returns customers not from Spain
	- The NOT operator can be used with comparison and/or logical operators
```SQL
SELECT column1, column2, ...
FROM table_name
WHERE NOT condition;
```
- Syntax
```SQL
SELECT * FROM Customers
-- WHERE CustomerName NOT LIKE 'A%';
-- WHERE CustomerID NOT BETWEEN 10 AND 60;
-- WHERE City NOT IN ('Paris', 'London');
-- WHERE NOT CustomerID > 50;
-- WHERE NOT CustomerId < 50;
```
- Selects customers that doesn't start with A
- Selects customers not between 10 and 60
- Selects customers not from Paris or London
- Selects customers not greater than 50
	- !> would give the same result
- Selects customers not less than 
	- !< gives same result
#### Exercises
![[Screenshot 2025-02-09 at 2.55.52 PM.png]]
### SQL Insert Into
- `INSERT INTO` statement is used to insert new records in a table
- Possible to write in two ways
```SQL
INSERT INTO table_name (column1, column2, column3, ...)
VALUES (value1, value2, value3, ...);
```
- (1) 1. Specify both the column names and the values to be inserted:
```SQL
INSERT INTO table_name
VALUES (value1, value2, value3, ...);
```
- (2) If adding values for all the columns of the table, you do not need to specify the column names in the SQL query. However, make sure the order of the values is in the same order as the columns in the table
```SQL
INSERT INTO Customers (CustomerName, ContactName, Address, City, PostalCode, Country)
VALUES ('Cardinal', 'Tom B. Erichsen', 'Skagen 21', 'Stavanger', '4006', 'Norway');
```
- Result
	- ![[Screenshot 2025-02-09 at 2.58.32 PM.png]]
	- Notice that `CustomerID` column is an auto-increment field and will be generated automatically when a new record is inserted into the table
```SQL
INSERT INTO Customers (CustomerName, City, Country)
VALUES ('Cardinal', 'Stavanger', 'Norway');
```
- Inserts data into specific columns
	- ![[Screenshot 2025-02-09 at 2.59.33 PM.png]]
	- Seems to make the columns without anything added `null`
```SQL
INSERT INTO Customers (CustomerName, ContactName, Address, City, PostalCode, Country)
VALUES
('Cardinal', 'Tom B. Erichsen', 'Skagen 21', 'Stavanger', '4006', 'Norway'),
('Greasy Burger', 'Per Olsen', 'Gateveien 15', 'Sandnes', '4306', 'Norway'),
('Tasty Tee', 'Finn Egan', 'Streetroad 19B', 'Liverpool', 'L1 0AA', 'UK');
```
- Inserting multiple rows
	- ![[Screenshot 2025-02-09 at 3.00.15 PM.png]]
#### Exercises
![[Screenshot 2025-02-09 at 3.03.37 PM.png]]

### SQL Null Values
- A field with a NULL value is a field with no value
- If a field in a table is optional, it is possible to insert a new record or update a record without adding a value to this field. Then, the field will be saved with a NULL value.
- A field with a NULL value is one that has been left blank during record creation!
- Not possible to test for NULL values with [[comparison operator|comparison operators]] (=, <, or <>)
	- Will use `IS NULL` and `IS NOT NULL` operators instead
```SQL
SELECT column_names
FROM table_name
-- WHERE column_name IS NULL;
-- WHERE _column_name_ IS NOT NULL;
-- One or the other above
```
- Syntax
- The `IS NULL` operator is used to test for empty values (NULL values).
	- Always use `IS NULL` to look for NULL values
- To test non-empty values
	- `WHERE Address IS NOT NULL`
#### Exercises
![[Screenshot 2025-02-09 at 5.55.57 PM.png]]

### SQL Update
- The UPDATE statement is used to modify the existing records in a table.
```SQL
UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE condition;
```
- The WHERE clause specifies which record(s) that should be updated. If you omit the WHERE clause, all records in the table will be updated!
```SQL
UPDATE Customers
SET ContactName = 'Alfred Schmidt', City= 'Frankfurt'
WHERE CustomerID = 1;
```
- Updates first customer with new contact and city
```SQL
UPDATE Customers
SET ContactName='Juan'
WHERE Country='Mexico';
```
- Updates multiple records
	- It is the `WHERE` clause that determines how many records will be updated
	- All records where country is "Mexico" will update the contact name to "Juan"
	- Without the `WHERE`clause, all records will update the `ContactName` to `Juan`
#### Exercises
![[Screenshot 2025-02-09 at 6.04.31 PM.png]]

### SQL Delete
- The [[DELETE (SQL)|DELETE]] statement is used to delete existing records in a table.
```SQL
DELETE FROM table_name WHERE condition;
```
-  The WHERE clause specifies which record(s) should be deleted. If you omit the WHERE clause, all records in the table will be deleted!
```SQL
DELETE FROM Customers WHERE CustomerName='Alfreds Futterkiste';
```
- Deletes the customer `Alfreds Futterkiste` from the table
```SQL
DELETE FROM table_name;
```
- Delete all records
	- It is possible to delete all rows in a table without deleting the table. This means that the table structure, attributes, and indexes will be intact
	- Above shows the syntax. Below shows example
```SQL
DELETE FROM Customers;
```
- This will delete all rows in the "Customers" table, without deleting the table for example
```SQL
DROP TABLE Customers;
```
- Deletes the table completely
	- [[DROP TABLE (SQL)|DROP TABLE]]
#### Exercises
![[Screenshot 2025-02-10 at 6.12.58 AM.png]]
### SQL Select Top
```SQL
-- Not all database systems support SELECT TOP
SELECT TOP 3 * FROM Customers;

-- MySQL
SELECT * FROM Customers  
LIMIT 3;

-- Oracle
SELECT * FROM Customers  
FETCH FIRST 3 ROWS ONLY;

-- 
-- Syntax of others Below
--

-- SQL Server / MS Access Syntax
SELECT TOP number|percent column_name(s)
FROM table_name
WHERE condition;

-- MySQL Syntax
SELECT column_name(s)
FROM table_name
WHERE condition
LIMIT number;

-- Oracle 12 Syntax
SELECT column_name(s)
FROM table_name
ORDER BY column_name(s)
FETCH FIRST number ROWS ONLY;

-- Older Oracle Syntax
SELECT column_name(s)
FROM table_name
WHERE ROWNUM <= number;

-- Older Oracle Syntax (with ORDER BY)
SELECT *
FROM (SELECT column_name(s) FROM table_name ORDER BY column_name(s))
WHERE ROWNUM <= number;
```
- The [[SELECT TOP (SQL)|SELECT TOP]] clause is used to specify the number of records to return.
	- Useful on large tables with thousands of records. Returning a large number of records can impact performance.
- For top example, select only the first 3 records of the Customers table:
	- Not all database systems support `SELECT TOP` clause
		- [[MySQL]] supports the LIMIT clause to select a limited number of records
		- [[Oracle]] uses `FETCH FIRST n ROWS ONLY` and `ROWNUM`
```SQL
-- SQL Server and MS Access
SELECT TOP 50 PERCENT * FROM Customers;

-- Oracle
SELECT * FROM Customers
FETCH FIRST 50 PERCENT ROWS ONLY;
```
- Selects the first 50% of the records from "Customers" table
```SQL
-- SQL SERVER / MS Access
SELECT TOP 3 * FROM Customers
WHERE Country='Germany';

-- MySQL
SELECT * FROM Customers  
WHERE Country='Germany'  
LIMIT 3;

-- Oracle
SELECT * FROM Customers  
WHERE Country='Germany'  
FETCH FIRST 3 ROWS ONLY;
```
- Selects first 3 records from "Customers" table where the country is "Germany"
```SQL
-- SQL Server / MS Access
SELECT TOP 3 * FROM Customers  
ORDER BY CustomerName DESC;

-- MySQL
SELECT * FROM Customers
ORDER BY CustomerName DESC
LIMIT 3;

-- Oracle
SELECT * FROM Customers
ORDER BY CustomerName DESC
FETCH FIRST 3 ROWS ONLY;
```
- [[ORDER BY (SQL)|ORDER BY]] keyword
	- Sort table reverse alphabetically and then return the first 3 records
		- #comment Essentially retrieves customers at end of alphabet

#### Exercises
![[Screenshot 2025-02-10 at 8.08.20 AM.png]]
### SQL Aggregate Functions
- An [[aggregate function]] is a function that performs a calculation on a set of values, and returns a single value.
- Aggregate functions are often used with the GROUP BY clause of the SELECT statement. The GROUP BY clause splits the result-set into groups of values and the aggregate function can be used to return a single value for each group.
- Most Common SQL aggregate functions
	- [[MIN() (SQL)|MIN()]] - returns the smallest value within the selected column
	- [[MAX() (SQL)|MAX()]] - returns the largest value within the selected column
	- [[COUNT() (SQL)|COUNT()]] - returns the number of rows in a set
	- [[SUM() (SQL)|SUM()]] - returns the total sum of a numerical column
	- [[AVG() (SQL)|AVG()]] - returns the average value of a numerical column
- Aggregate functions ignore null values (except for `COUNT())
### SQL Min and Max
- The [[MIN() (SQL)|MIN()]] function returns the smallest value of the selected column.
- The [[MAX() (SQL)|MAX()]] function returns the largest value of the selected column.
```SQL
-- Lowest Price in column
SELECT MIN(Price)  
FROM Products;

-- Highest price in Column
SELECT MAX(Price)  
FROM Products;

-- Syntax for MIN
SELECT MIN(_column_name_)  
FROM _table_name_  
WHERE _condition_;

-- Syntax for MAX
SELECT MAX(_column_name_)  
FROM _table_name_  
WHERE _condition_;
```
- Examples to find minimum and maximum prices as well as showing syntax
```SQL
SELECT MIN(Price) AS SmallestPrice
FROM Products;
```
- Using Min or Max will not return a column with a descriptive name. Must use the [[AS (SQL)|AS]] keyword to give column a descriptive name
	- ![[Screenshot 2025-02-10 at 8.18.50 AM.png|300]]
		- With `AS` and without `AS`
```SQL
SELECT MIN(Price) AS SmallestPrice, CategoryID
FROM Products
GROUP BY CategoryID;
```
- This returns the smallest price for each category in the products table
	- ![[Screenshot 2025-02-10 at 8.19.48 AM.png|400]]
		- Select the minimum price from the products table from each group based on their CategoryID
#### Exercises
![[Screenshot 2025-02-10 at 8.22.44 AM.png]]

### SQL Count
```SQL
-- Total number of rows in Products table
SELECT COUNT(*)
FROM Products;

-- Syntax
SELECT COUNT(column_name)
FROM table_name
WHERE condition;
```
- The [[COUNT() (SQL)|COUNT()]] function returns the number of rows that matches a specified criterion.
```SQL
-- Find number of products for ProductName column and NULL values not counted
SELECT COUNT(ProductName)
FROM Products;

-- Find products where Price is higher than 20
SELECT COUNT(ProductID)  
FROM Products  
WHERE Price > 20;

-- Ignore duplicates with DISTINCT keyword. 
-- If DISTINCT specified, rows with the same value for specified colum will be counted as one
-- Shows how many different prices there are in the Products table
SELECT COUNT(DISTINCT Price)  
FROM Products;

-- Returns number of records and specifes column name using `AS`
SELECT COUNT(*) AS [Number of records]  
FROM Products;

-- Returns number of records for each category in Products Table
SELECT COUNT(*) AS [Number of records], CategoryID  
FROM Products  
GROUP BY CategoryID;

```
- [[DISTINCT (SQL)|DISTINCT]]
- For last example
	- ![[Screenshot 2025-02-10 at 8.29.10 AM.png]]
#### Exercises
![[Screenshot 2025-02-10 at 8.31.49 AM.png]]
### SQL Sum
```SQL
-- Returns sum of all Quantity fields in the OrderDetails table
SELECT SUM(Quantity)
FROM OrderDetails;

-- Syntax
SELECT SUM(column_name)
FROM table_name
WHERE condition;

-- Return sum of the `Quantity` field for the product with ID 11
SELECT SUM(Quantity)
FROM OrderDetails
WHERE ProductId = 11;

-- Using alias (naming the column total) using `AS` keyword
SELECT SUM(Quantity) AS total
FROM OrderDetails;

-- Returns quantity for each OrderID in the OrderDetails table
SELECT OrderID, SUM(Quantity) AS [Total Quantity]
FROM OrderDetails
GROUP BY OrderID;

-- SUM() can also be an expression
-- Multiplying each quantity here by 10
SELECT SUM(Quantity * 10)
FROM OrderDetails;
```
- The [[SUM() (SQL)|SUM()]] function returns the total sum of a numeric column.
```SQL
SELECT SUM(Price * Quantity)
FROM OrderDetails
LEFT JOIN Products ON OrderDetails.ProductID = Products.ProductID;
```
- Joining `OrderDetails` table with `Products` table and summing to find the total price of the products
	- Will learn about Joins later
	- #question I don't understand this one
#### Exercises
![[Screenshot 2025-02-10 at 10.12.32 AM.png]]
### SQL Avg
```SQL
-- Finding aveare price of all products (NULL value ignored)
SELECT AVG(Price)
FROM Products;

-- Syntax
SELECT AVG(column_name)
FROM table_name
WHERE condition;

-- Return average price of products in category 1
SELECT AVG(Price)
FROM Products
WHERE CategoryID = 1;

-- Give AVG column a name using `AS` keyword
SELECT AVG(Price) AS [average price]
FROM Products;

-- Retrun products with higeher price than average price 
-- with AVG() function in a sub query
SELECT * FROM Products
WHERE price > (SELECT AVG(price) FROM Products);

-- Return average price for each category in the products table
SELECT AVG(Price) AS AveragePrice, CategoryID
FROM Products
GROUP BY CategoryID;
```
- The `AVG()` function returns the average value of a numeric column.
	- #question Does doing the subquery mean it's calculated once or multiple times?

#### Exercises
![[Screenshot 2025-02-10 at 10.18.10 AM.png]]

### SQL Like
```SQL
-- Select all customers that start with "a"
SELECT * FROM Customers
WHERE CustomerName LIKE 'a%';

-- Syntax
SELECT column1, column2, ...
FROM table_name
WHERE columnN LIKE pattern;
```
- The `LIKE` operator is used in a `WHERE` clause to search for a specified pattern in a column.
- There are two wildcards often used in conjunction with the `LIKE` operator:
	- The percent sign `%` represents zero, one, or multiple characters
	- The underscore sign `_` represents one, single character
```SQL
-- Return customers from city that starts with L, followed by a wildcard character, then 'nd' and then two wildcard characters
SELECT * FROM Customers  
WHERE city LIKE 'L_nd__';
```
- The `_` wildcard represents a single character
	- It can be any character or number, but each `_` represents one, and only one, character.
```SQL
-- Return all customers from a city that _contains_ the letter 'L':
SELECT * FROM Customers
WHERE city LIKE '%L%';
```
- The % wildcard represents any number of characters, even zero characters.
```SQL
-- Return customers that start with 'La'
SELECT * FROM Customers
WHERE CustomerName LIKE 'La%';

-- Return customers whose name starts with 'a' or 'b'
SELECT * FROM Customers
WHERE CustomerName LIKE 'a%' OR CustomerName LIKE 'b%';
```
- To return records that starts with a specific letter or phrase, add the % at the end of the letter or phrase.
	- #comment Solves the 'starts with' type of problems
	- You can also combine any number of conditions using `AND` or `OR` operators.
```SQL
-- Returns customers that ends with 'a'
SELECT * FROM Customers  
WHERE CustomerName LIKE '%a';

-- Return customers that start with 'b' and ends with 's'
SELECT * FROM Customers  
WHERE CustomerName LIKE 'b%s';
```
- To return records that ends with a specific letter or phrase, add the `%` at the beginning of the letter or phrase.
	- Can also combine 'starts with' and 'ends with'
```SQL
-- Return all customers that contains the phrase 'or'
SELECT * FROM Customers
WHERE CustomerName LIKE '%or%';

-- Return customers that start with a and at least 3 characters in length
SELECT * FROM Customers
WHERE CustomerName LIKE 'a__%';

-- Return customers with 'r' in second position
SELECT * FROM Customers  
WHERE CustomerName LIKE '_r%';

-- Return all customers from Spain
SELECT * FROM Customers
WHERE Country LIKE 'Spain';
```
- To return records that contains a specific letter or phrase, add the `%` both before and after the letter or phrase.
	- #comment Solves the 'contains' problem
- Wildcard combinations also possible
	- #comment without wildcard such as `WHERE Country LIKE 'Spain'` is probably equivalent to `WHERE Country = 'Spain'`
#### Exercises
![[Screenshot 2025-02-10 at 10.33.35 AM.png]]
### SQL Wildcards
```SQL
-- Returns all customers that start with the letter a
SELECT * FROM Customers
WHERE CustomerName LIKE 'a%';
```
- A [[wildcard character]] is used to substitute one or more characters in a string.
- Wildcard characters are used with the LIKE operator. The LIKE operator is used in a WHERE clause to search for a specified pattern in a column.

| Symbol | Description                                                  |
| ------ | ------------------------------------------------------------ |
| %      | Represents zero or more characters                           |
| _      | Represents a single character                                |
| []     | Represesents any single character within the brackets *      |
| ^      | Represents any character not in the brackets *               |
| -      | Represents any single character within the specified range * |
| {}     | Represents any escaped character **                          |
- Wildcard characters
	* Means not supported in PostgreSQL and MySQL databases
	-  ** Supported only in Oracle databases
```SQL
-- Returns customers that ends in 'es'
SELECT * FROM Customers  
WHERE CustomerName LIKE '%es';

-- Returns customers that contain 'mer'
SELECT * FROM Customers  
WHERE CustomerName LIKE '%mer%';

-- Returns customers with City starting with any character followed by "ondon"
SELECT * FROM Customers  
WHERE City LIKE '_ondon';

-- Returns 'L' + 3 characters + "on"
SELECT * FROM Customers  
WHERE City LIKE 'L___on';

-- Returns all customers starting with either "b", "s", or "p"
SELECT * FROM Customers  
WHERE CustomerName LIKE '[bsp]%';

-- Return all customers starting with "a", "b", "c", "d", "e" or "f":
SELECT * FROM Customers
WHERE CustomerName LIKE '[a-f]%';

-- Return customers starting with "a" and are at least 3 characters in length
SELECT * FROM Customers
WHERE CustomerName LIKE 'a__%';

-- Customers with "r" in second position
SELECT * FROM Customers
WHERE CustomerName LIKE '_r%';

-- Return customers in Spain (no wildcard)
SELECT * FROM Customers
WHERE Country LIKE 'Spain';
```
- The `%` wildcard represents any number of characters, even zero characters.
- The `_` wildcard represents a single character.
	- It can be any character or number, but each `_` represents one, and only one, character.
- The `[]` wildcard returns a result if _any_ of the characters inside gets a match.
	- #question is this regex?
- The `-` wildcard allows you to specify a range of characters inside the `[]` wildcard.
- Any wildcard, like % and _ , can be used in combination with other wildcards.
- If no wildcard is specified, the phrase has to have an exact match to return a result.

| Symbol | Description                                                | Example                                                          |
| ------ | ---------------------------------------------------------- | ---------------------------------------------------------------- |
| **     | Represents zero or more characters                         | `bl*` finds bl, black, blue, and blob                            |
| ?      | Represents a single character                              | `h?t` finds hot, hat, and hit                                    |
| []     | Represents any single character within the brackets        | `h[oa]t` finds hot and hat, but not hit                          |
| !      | Represents any character not in the brackets               | `h[!oa]t` finds hit, but not hot and hat                         |
| -      | Represents any single character within the specified range | `c[a-b]t` finds cat and cbt                                      |
| #      | Represents any single numeric character                    | `2#5` finds 205, 215, 225, 235, 245, 255, 265, 275, 285, and 295 |
- Microsoft Access Wildcards
	- This database has some other wildcards
#### Exercises
![[Screenshot 2025-02-10 at 12.11.02 PM.png]]
#question How would you parse the `!` character?
### SQL In
```SQL
-- Return all customers from 'Germany', 'France', or 'UK'
SELECT * FROM Customers
WHERE Country IN ('Germany', 'France', 'UK');

-- Syntax
SELECT column_name(s)
FROM table_name
WHERE column_name IN (value1, value2, ...);

-- Return all customers that are NOT from 'Germany', 'France', or 'UK':
SELECT * FROM Customers  
WHERE Country NOT IN ('Germany', 'France', 'UK');

-- Return all customers that have an order in the Orders table:
SELECT * FROM Customers  
WHERE CustomerID IN (SELECT CustomerID FROM Orders);

-- Checks customers that haven't placed orders
SELECT * FROM Customers
WHERE CustomerID NOT IN (SELECT CustomerID FROM Orders);

```
- The [[IN (SQL)|IN]] operator allows you to specify multiple values in a WHERE clause.
- The IN operator is a shorthand for multiple [[OR (SQL)|OR]] conditions.
- Not In
	- You return all records that are NOT any of the values in the list.
- Can use `IN` with a [[subquery]]
	- With a subquery, you can return all records from the main query that are present in the result of the subquery.

#### Exercises
![[Screenshot 2025-02-10 at 12.18.39 PM.png]]

### SQL Between
```SQL
-- Select products between 10 and 20
SELECT * FROM Products
WHERE Price BETWEEN 10 AND 20;

-- Syntax
SELECT column_name(s)
FROM table_name
WHERE column_name BETWEEN value1 AND value2;

-- Not Between (outside range of 10 and 20)
SELECT * FROM Products
WHERE Price NOT BETWEEN 10 AND 20;

-- Returns Products with price between 10 and 20 and with CategoryID 1, 2, or 3
SELECT * FROM Products  
WHERE Price BETWEEN 10 AND 20  
AND CategoryID IN (1,2,3);

-- Product name is alphabetically between
-- Carnarvon Tigers and Mozzarella di Giovanni
SELECT * FROM Products
WHERE ProductName BETWEEN 'Carnarvon Tigers' AND 'Mozzarella di Giovanni'
ORDER BY ProductName;

-- NOT BETWEEN
SELECT * FROM Products
WHERE ProductName BETWEEN 'Carnarvon Tigers' AND 'Mozzarella di Giovanni'
ORDER BY ProductName;

-- OrderDate between '01-July-1996' and '31-July-1996'
SELECT * FROM Orders
WHERE OrderDate BETWEEN #07/01/1996# AND #07/31/1996#;

-- Date Alternative
SELECT * FROM Orders  
WHERE OrderDate BETWEEN '1996-07-01' AND '1996-07-31';

```
- The [[BETWEEN (SQL)|BETWEEN]] operator selects values within a given range. The values can be numbers, text, or dates.
- The `BETWEEN` operator is inclusive: begin and end values are included.

#### Exercises
![[Screenshot 2025-02-10 at 12.26.25 PM.png]]

### SQL Aliases
```SQL
-- Returns CustomerID from 'Customers' table in column 'ID'
SELECT CustomerID AS ID
FROM Customers;

-- Returns alias without 'AS'
SELECT CustomerID ID  
FROM Customers;

-- Syntax (alias used in column)
SELECT column_name AS alias_name
FROM table_name;

-- Syntax (alias used on table)
SELECT column_name(s)
FROM table_name AS alias_name;

-- Creating aliases for two columns
SELECT CustomerID AS ID, CustomerName AS Customer
FROM Customers;

-- Creating Alias with spaces
-- Just use square brackets
SELECT ProductName AS [My Great Products]  
FROM Products;

-- Could also use double quotes for aliases with a space in its name
SELECT ProductName AS "My Great Products"  
FROM Products;

-- 
```
- SQL aliases are used to give a table, or a column in a table, a temporary name.
	- Aliases are often used to make column names more readable.
	- An alias only exists for the duration of that query.
	- An alias is created with the `AS` keyword.
- In most database languages, you can skip the AS keyword and get the same result
- Some databases allow both `[]` and "", and some only allows one when creating aliases with a space in its name
```SQL
-- Combines four columns
SELECT CustomerName, Address + ', ' + PostalCode + ' ' + City + ', ' + Country AS Address  
FROM Customers;

-- Equivalent statement for MySQL
SELECT CustomerName, CONCAT(Address,', ',PostalCode,', ',City,', ',Country) AS Address
FROM Customers;

-- Equivalent Statement for Oracle
SELECT CustomerName, (Address || ', ' || PostalCode || ' ' || City || ', ' || Country) AS Address
FROM Customers;
```
- Concatenating columns
	- This creates an alias named "Address" that combine four columns
	- ![[Screenshot 2025-02-10 at 12.41.42 PM.png]]
		- The right side is the output
```SQL
-- Refer Customers table as Persons
SELECT * FROM Customers AS Persons;

-- Makes aliases shorter here
SELECT o.OrderID, o.OrderDate, c.CustomerName  
FROM Customers AS c, Orders AS o  
WHERE c.CustomerName='Around the Horn' AND c.CustomerID=o.CustomerID;

-- Without aliases
SELECT Orders.OrderID, Orders.OrderDate, Customers.CustomerName  
FROM Customers, Orders  
WHERE Customers.CustomerName='Around the Horn' AND Customers.CustomerID=Orders.CustomerID;
```
- Alias for Tables
	- Useful so that when using more than one table in your queries, can make the SQL statements shorter
- Aliases can be useful when
	- There are more than one table involved in a query
	- Functions are used in the query
	- Column names are big or not very readable
	- Two or more columns are combined together
#### Exercises
![[Screenshot 2025-02-10 at 1.07.19 PM.png]]
### SQL Joins
- A [[JOIN (SQL)]] clause is used to combine rows from two or more tables, based on a related column between them.
- ![[Screenshot 2025-02-10 at 1.10.01 PM.png]]
	- The `CustomerID` column in the "Orders" table refers to the `CustomerID` column in the Customers table
		- The relationships between the two tables is the `CustomerID` column
```SQL
SELECT Orders.OrderID, Customers.CustomerName, Orders.OrderDate
FROM Orders
INNER JOIN Customers ON Orders.CustomerID=Customers.CustomerID;
```
- Can create SQL statement (that contains an [[INNER JOIN (SQL)|INNER JOIN]]) that selects records that have matching values in both tables
	- #question What is meant by `ON`?
	- #question How dos this work?
	- Will produce this
		- ![[Screenshot 2025-02-10 at 1.14.16 PM.png]]
- Types of SQL joins
	- (INNER) JOIN: Returns that have matching values in both tables
	- LEFT (OUTER) JOIN: Returns all records from the left table, and the matched records from the right table
	- RIGHT (OUTER) JOIN: Returns all records from the right table, and the matched records from the left table
	- FULL (OUTER) JOIN: Returns all records when there is a match in either left or right table
	- Diagram
		- ![[Screenshot 2025-02-10 at 1.21.57 PM.png]]
#### Exercises
![[Screenshot 2025-02-10 at 1.27.02 PM.png]]
### SQL Inner Join
- The [[INNER JOIN (SQL)|INNER JOIN]] keyword selects records that have matching values in both tables
```SQL
SELECT ProductID, ProductName, CategoryName
FROM Products
INNER JOIN Categories ON Products.CategoryID = Categories.CategoryID
```
- The order of commands is FROM, INNER JOIN, and then SELECT
- The `INNER JOIN` keyword returns only rows with a match in both tables.
	- So if you have a product with no CategoryID, or with a CategoryID not present in the Categories table, that record would not be returned in the result
- #status/incomplete
### SQL Left Join
### SQL Right Join
### SQL Full Join
### SQL Self Join
### SQL Union
### SQL Group By
### SQL Having
### SQL Exists
### SQL Any, All
### SQL Select Into
### SQL Insert Into Select
### SQL Case
### SQL Null Functions
### SQL Stored Procedures
### SQL Comments
### SQL Operators
## SQL Database
### SQL Create DB
### SQL Drop DB
### SQL Backup DB
### SQL Create Table
### SQL Drop Table
### SQL Alter Table
### SQL Constraints
### SQL Not Null
### SQL Unique
### SQL Primary Key
### SQL Foreign Key
### SQL Check
### SQL Default
### SQL Index
### SQL Auto Increment
### SQL Dates
### SQL Views
### SQL Injection
### SQL Hosting
### SQL Data Types
## SQL References
### SQL Keywords
#### ADD
- [[ADD (SQL)|ADD]] is used to add a column in an existing table
```SQL
ALTER TABLE Customers
ADD Email varchar(255);
```
- Adds an "Email" column to the customers table
- Description[^1]
	- `ALTER TABLE`: Modifying the structure of an existing table
	- `Email`: Name of new column being added
	- `varchar(255)` Defines the data type as a variable-length string with a maximum length of 255 characters
#### ADD CONSTRAINT
- Creates a constraint after a table is already created
```SQL
ALTER TABLE Persons
ADD CONSTRAINT PK_Person PRIMARY KEY (ID,LastName);
```
- Adds a constraint named `PK_Person` that is a primary key constraint on multiple columns (ID and LastName)
	- #question What is a primary key constraint?
	- #question What will the constraint do in turn? Does it mean the column name can't be changed later?
#### ALL
- [[ALL (SQL)|ALL]] returns true if all of the subquery values meet the condition
```SQL
SELECT ProductName
FROM Products
WHERE ProductID = ALL (SELECT ProductID FROM OrderDetails WHERE Quantity = 10);
```
- Returns TRUE and lists the ProductName If ALL the records in the OrderDetails table has quantity = 10
#### ALTER TABLE
- `ALTER TABLE` 
	- Adds, deletes, or modifies columns in a table
	- Adds and deletes various constraints in a table
```SQL
ALTER TABLE Customers
ADD Email varchar(255);
```
- Adds an "Email" column to "Customers" table
```SQL
ALTER TABLE Customers
DROP COLUMN Email;
```
- Deletes "Email" column from "Customers" table
	- #question Will an error occur if an "Email" column did not exist?
#### ALTER COLUMN
- `ALTER COLUMN`
	- Change the data type of a column in a table
```SQL
ALTER TABLE Employees
ALTER COLUMN BirthDate year;
```
- Changes data type of column named "BirthDate" in the "Employees" table to type year
	- #question What does type `year` look like?
#### AND
- [[AND (SQL)|AND]] used with WHERE to only include rows where both conditions true
```SQL
SELECT * FROM Customers
WHERE Country='Germany' AND City='Berlin';
```
- Select all fields from table `Customers` where where Country is Germany and city is Berlin
#### ANY
- [[ANY (SQL)|ANY]] returns true if any of the subquery values meet the condition
```SQL
SELECT ProductName
FROM Products
WHERE ProductID = ANY (SELECT ProductID FROM OrderDetails WHERE Quantity = 10);
```
- Returns true and lists the ProductName if it finds any records in the OrderDetails table where quantity = 10
```SQL
SELECT ProductName
FROM Products
WHERE ProductID = ANY (SELECT ProductID FROM OrderDetails WHERE Quantity > 99);
```
- Same as above but only if ANY records in the OrderDetails table have a quantity above 99
	- #question Is 'ANY' even required here? Is this just required for a subquery? Can't we just use the `WHERE` condition by itself for this case? (although I guess we do need to reference a separate table)
#### AS
- [[AS (SQL)|AS]] is used to rename a column or table with an alias
	- Alias only exists for duration of query
```SQL
-- Creates 2 aliases. One for CustomerID and other for CustomerName
SELECT CustomerID AS ID, CustomerName AS Customer  
FROM Customers;

-- Requires double quotation marks or square brackets if alias contains spaces
SELECT CustomerName AS Customer, ContactName AS [Contact Person]  
FROM Customers;

-- Creates an alias named Address which combines four columns
SELECT CustomerName, Address + ', ' + PostalCode + ' ' + City + ', ' + Country AS Address  
FROM Customers;

-- Use this for MySQL to get above snippet working
SELECT CustomerName, CONCAT(Address,', ',PostalCode,', ',City,', ',Country) AS Address  
FROM Customers;

-- Using aliases to make SQL shorter
-- Selects all customers with CustomerID = 4 (Around the Horn)
SELECT o.OrderID, o.OrderDate, c.CustomerName  
FROM Customers AS c, Orders AS o  
WHERE c.CustomerName="Around the Horn" AND c.CustomerID=o.CustomerID;
```
#### ASC
- [[ASC (SQL)|ASC]] is used to sort the data returned in ascending order
```SQL
SELECT * FROM Customers
ORDER BY CustomerName ASC;
```
- Sorted Customers table by the "CustomerName" column
#### BACKUP DATABASE
- Used in SQL Server to create a full back up of an existing SQL database
```SQL
BACKUP DATABASE testDB
TO DISK = 'D:\backups\testDB.bak';
```
- Creates a full back up of the existing database "testDB" to the D disk
	- #question What kind of data format is `.bak`? I guess it stands for backup?
- Important
	- Always back up database to different drive than actual database
	- If you get a disk crash, you will not lose your backup file along with the database
```SQL
BACKUP DATABASE testDB
TO DISK = 'D:\backups\testDB.bak'
WITH DIFFERENTIAL;
```
- A differential back up only backs up the parts of the database that have changed since the last full database backup
- Creates a differential back up of the database "testDB"
	- #question Does this mean it just appends or overwrites the existing data or just it just save what the changes are?
- A differential back up reduces back up time (since only the changes are backed up)
	- #question Does this mean the old unchanged data is still backed up or lost?

#### BETWEEN
- [[BETWEEN (SQL)|BETWEEN]]
	- Select values within a given range. Values can be numbers, text, or dates
	- Inclusive. Begin and end values included
```SQL
-- Selects all products with price between 10 and 20
SELECT * FROM Products
WHERE Price BETWEEN 10 AND 20;

-- Selects all products outside of range 10 and 20
SELECT * FROM Products  
WHERE Price NOT BETWEEN 10 AND 20;

-- Selects all products with a ProductName between the two names
SELECT * FROM Products  
WHERE ProductName BETWEEN 'Carnarvon Tigers' AND 'Mozzarella di Giovanni'  
ORDER BY ProductName;
```
- ![[Screenshot 2025-02-22 at 12.41.16 AM.png]]
	- #comment Seems to then be ordered by the product name for last snippet. Default ascending
#### CASE
- [[CASE (SQL)|CASE]]
	- Used to create different output based on conditions
```SQL
-- Goes through several conditions and returns a value
-- when the specified condition is met
SELECT OrderID, Quantity,
CASE WHEN Quantity > 30 THEN 'The quantity is greater than 30'
WHEN Quantity = 30 THEN 'The quantity is 30'
ELSE 'The quantity is under 30'
END AS QuantityText
FROM OrderDetails;

-- Will order custombers by Cit. If City is NULL, then order by Country
SELECT CustomerName, City, Country
FROM Customers
ORDER BY
(CASE
    WHEN City IS NULL THEN Country
    ELSE City
END);
```
- First Snippet
	- ![[Screenshot 2025-02-22 at 12.44.40 AM.png]]
#### CHECK
- [[CHECK (SQL)|CHECK]] constraint limits the value that can be placed in a column
```SQL
-- MySQL
-- Crates a CHECK constraint on the "Age" column
-- Ensures no person beow 18 years
CREATE TABLE Persons (
    Age int,
    CHECK (Age>=18)
);

-- SQL Server / Oracle / MS Access
CREATE TABLE Persons (  
    Age int CHECK (Age>=18)  
);

-- MySQL / SQL Server / Oracle / MS Access
-- Allows for naming of a CHECK constraint
-- Defines a CHECK constraint on multiple columns
CREATE TABLE Persons (  
    Age int,  
    City varchar(255),  
    CONSTRAINT CHK_Person CHECK (Age>=18 AND City='Sandnes')  
);
```
- #question What does naming a CHECK constraint mean?
```SQL

-- MySQL / SQL Server / Oracle / MS Access
-- Creates a CHECK constraint on "Age" column when table already created
ALTER TABLE Persons
ADD CHECK (Age>=18);

-- MySQL / SQL Server / Oracle / MS Access
-- Allows naming of a CHECK constraint
-- Defining a CHECK constraint on multiple columns
ALTER TABLE Persons  
ADD CONSTRAINT CHK_PersonAge CHECK (Age>=18 AND City='Sandnes');
```
- SQL Check on Alter Table
```SQL
-- Drops a CHECK constraint

-- SQL Server / Oracle / MS Access
ALTER TABLE Persons  
DROP CONSTRAINT CHK_PersonAge;

-- MySQL
ALTER TABLE Persons  
DROP CHECK CHK_PersonAge;
```
#### CONSTRAINT
- `ADD CONSTRAINT`
	- Create a constraint after a table is already created
```SQL
-- The following SQL adds a constraint named "PK_Person" 
-- that is a PRIMARY KEY constraint on multiple columns (ID and LastName):
ALTER TABLE Persons
ADD CONSTRAINT PK_Person PRIMARY KEY (ID,LastName);
```
- #question What is a primary key constraint?
- `DROP CONSTRAINT`
	- Delete a UNIQUE, PRIMARY KEY, FOREIGN KEY, or CHECK constraint
```SQL
-- SQL Server / Oracle / MS Access
ALTER TABLE Persons  
DROP CONSTRAINT UC_Person;

-- MySQL
ALTER TABLE Persons  
DROP INDEX UC_Person;
```
- Drops a unique constraint
```SQL

-- SQL Server / Oracle / MS Access
ALTER TABLE Persons  
DROP CONSTRAINT PK_Person;

-- MySQL
ALTER TABLE Persons  
DROP PRIMARY KEY;
```
- Drops a Primary Key Constraint
```SQL
-- SQL Server / Oracle / MS Access
ALTER TABLE Orders  
DROP CONSTRAINT FK_PersonOrder;

-- My SQL
ALTER TABLE Orders  
DROP FOREIGN KEY FK_PersonOrder;
```
- Drop a Foreign Key Constraint
```SQL
-- SQL Server / Oracle / MS Access
ALTER TABLE Persons  
DROP CONSTRAINT CHK_PersonAge;

-- My SQL
ALTER TABLE Persons  
DROP CHECK CHK_PersonAge;
```
- Drops a Check Constraint
#### CREATE DATABASE
```SQL
CREATE DATABASE testDB;
```
- `CREATE DATABASE` Used to create a new SQL database
	- The above creates a database called "testDB"
- Have admin privilege before creating any database
	- Can check list of databases with `SHOW DATABASES;`
#### CREATE INDEX
- `CREATE INDEX` is used to create indexes in tables (allows duplicate values)
- Indexes are used to retrieve data from the database very fast
	- User cannot see the indexes, they are just used to speed up searches / queries
```SQL
-- Creates an index named "idx_lastname" on the "LastName" column
CREATE INDEX idx_lastname  
ON Persons (LastName);

-- Creating an index on a combination of columns
CREATE INDEX idx_pname  
ON Persons (LastName, FirstName);
```
- #question How does an index make querying faster?
- Syntax for creating indexes varies among different databases. Check the syntax for creating indexes in your database
- Note
	- Updating a table with indexes takes more time than updating a table without (because the index also need an update)
	- Only create indexes on columns that will be frequently searched against
#### CREATE OR REPLACE VIEW
- Updates a view
```SQL
CREATE OR REPLACE VIEW [Brazil Customers] AS
SELECT CustomerName, ContactName, City
FROM Customers
WHERE Country = "Brazil";

-- Able to query the view afterwards
SELECT * FROM [Brazil Customers];
```
- Adds the "City" column to the "Brazil Customers" view
- #question What does this look like in practice?
#### CREATE TABLE
- Creates a new table in the database
```SQL
CREATE TABLE Persons (
    PersonID int,
    LastName varchar(255),
    FirstName varchar(255),
    Address varchar(255),
    City varchar(255)
);
```
- Creates a table called "Persons" containing 5 columns
```SQL
CREATE TABLE TestTable AS
SELECT customername, contactname
FROM customers;
```
- Creates a new table called "TestTables" which is a copy of two columns of the "Customers" table
- #question What is the point of `AS` here?
#### CREATE PROCEDURE
- Creates a stored procedure
- A [[stored procedure]] is a prepared SQL code that you can save, so the code can be reused over and over again
```SQL
CREATE PROCEDURE SelectAllCustomers
AS
SELECT * FROM Customers
GO;
```
- Creates a stored procedure named "SelectAllCustomers" that selects all records from the "Customers" table
- #question Is the "GO" necessary?
```SQL
EXEC SelectAllCustomers;
```
- This executes the stored procedure above
#### CREATE UNIQUE INDEX
- Creates a unique index on a table (no duplicate values allowed)
- Indexes are used to retrieve data from the database very fast. The users cannot see the indexes, they are just used to speed up searches/queries.
```SQL
CREATE UNIQUE INDEX uidx_pid
ON Persons (PersonID);
```
- Creates an index named "uidx_pid" on the "PersonID" column
- Syntax for indexes varies among different databases
- Updating a table with indexes takes more time than a table without so only create indexes on columns that will be frequently searched
#### CREATE VIEW
- Creates a view
- A [[view]] is a virtual table based on the result set of an SQL statement.
```SQL
CREATE VIEW [Brazil Customers] AS
SELECT CustomerName, ContactName
FROM Customers
WHERE Country = "Brazil";
```
- Creates a view selecting all customers from Brazil
```SQL
SELECT * FROM [Brazil Customers];
```
- Queries the view above
#### DEFAULT
- The DEFAULT constraint provides a default value for a column
	- Default value will be added to all new records if no other value is specified
```SQL
-- My SQL / SQL Server / Oracle / MS Access

-- Sets default value for "City" column which in this case is 'Sandnes'
CREATE TABLE Persons (
    City varchar(255) DEFAULT 'Sandnes'
);

-- Default Constraint can also be used to insert system values
-- such as GETDATE()
CREATE TABLE Orders (
    OrderDate date DEFAULT GETDATE()
);
```
- SQL DEFAULT on CREATE TABLE
```SQL

-- MySQL
ALTER TABLE Persons
ALTER City SET DEFAULT 'Sandnes';

-- SQL Server
ALTER TABLE Persons  
ADD CONSTRAINT df_City  
DEFAULT 'Sandnes' FOR City;

-- MS Access
ALTER TABLE Persons  
ALTER COLUMN City SET DEFAULT 'Sandnes';

-- Oracle
ALTER TABLE Persons  
MODIFY City DEFAULT 'Sandnes';
```
- SQL DEFAULT on ALTER TABLE
	- In this example, creates a default constraint on the "City" column when the table is already created
	- #question Does this actively change the existing ones?
```SQL
-- MySQL
ALTER TABLE Persons
ALTER City DROP DEFAULT;

-- SQL Server / Oracle / MS Access
ALTER TABLE Persons
ALTER COLUMN City DROP DEFAULT;
```
- DROP a DEFAULT Constraint
#### DELETE
#### DESC
#### DISTINCT
#### DROP
#### DROP COLUMN
#### DROP CONSTRAINT
#### DROP DATABASE
#### DROP DEFAULT
#### DROP INDEX
#### DROP TABLE
#### DROP VIEW
#### EXEC
#### EXISTS
#### FOREIGN KEY
#### FROM
#### FULL OUTER JOIN
#### GROUP BY
#### HAVING
#### IN
#### INDEX
#### INNER JOIN
#### INSERT INTO
#### INSERT INTO SELECT
#### IS NULL
#### IS NOT NULL
#### JOIN
#### LEFT JOIN
#### LIKE
#### LIMIT
#### NOT
#### NOT NULL
#### OR
#### ORDER BY
#### OUTER JOIN
#### PRIMARY KEY
#### PROCEDURE
#### RIGHT JOIN
#### ROWNUM
#### SELECT
#### SELECT DISTINCT
#### SELECT INTO
#### SELECT TOP
#### SET
#### TABLE
#### TOP
#### TRUNCATE TABLE
#### UNION
#### UNION ALL
#### UNIQUE
#### UPDATE
#### VALUES
#### VIEW
#### WHERE
### MySQL Functions
#### MySQL String Functions
##### ASCII
##### CHAR_LENGTH
##### CHARACTER_LENGTH
##### CONCAT
##### CONCAT_WS
##### FIELD
##### FIND_IN_SET
##### FORMAT
##### INSERT
##### INSTR
##### LCASE
##### LEFT
##### LENGTH
##### LOCATE
##### LOWER
##### LPAD
##### LTRIM
##### MID
##### POSITION
##### REPEAT
##### REPLACE
##### REVERSE
##### RIGHT
##### RPAD
##### RTRIM
##### SPACE
##### STRCMP
##### SUBSTR
##### SUBSTRING
##### SUBSTRING_INDEX
##### TRIM
##### UCASE
##### UPPER
#### MySQL Numeric Functions
##### ABS
##### ACOS
##### ASIN
##### ATAN
##### ATAN2
##### AVG
##### CEIL
##### CEILING
##### COS
##### COT
##### COUNT
##### DEGREES
##### DIV
##### EXP
##### FLOOR
##### GREATEST
##### LEAST
##### LN
##### LOG

##### LOG10
##### LOG2
##### MAX
##### MIN
##### MOD
##### PI
##### POW
##### POWER
##### RADIANS
##### RAND
##### ROUND
##### SIGN
##### SIN
##### SQRT
##### SUM
##### TAN
##### TRUNCATE
#### MySQL Date Functions
##### ADDDATE
##### ADDTIME
##### CURDATE
##### CURRENT_DATE
##### CURRENT_TIME
##### CURTIME
##### DATE
##### DATEDIFF
##### DATE_ADD
##### DATE_FORMAT
##### DATE_SUB
##### DAY
##### DAYNAME
##### DAYOFMONTH
##### DAYOFWEEK
##### DAYOFYEAR
##### EXTRACT
##### FROM_DAYS
##### HOUR
##### LAST_DAY
##### LOCALTIME
##### LOCALTIMESTAMP
##### MAKEDATE
##### MAKETIME
##### MICROSECOND
##### MINUTE
##### MONTH
##### MONTHNAME
##### NOW
##### PERIOD_ADD
##### PERIOD_DIFF
##### QUARTER
##### SECOND
##### SEC_TO_TIME
##### STR_TO_DATE
##### SUBDATE
##### SUBTIME
##### SYSDATE
##### TIME
##### TIME_FORMAT
##### TIME_TO_SEC
##### TIMEDIFF
##### TIMESTAMP
##### TO_DAYS
##### WEEK
##### WEEKDAY
##### WEEKOFYEAR
##### YEAR
##### YEARWEEK
#### MySQL Advanced Functions
##### BIN
##### BINARY
##### CASE
##### CAST
##### COALESCE
##### CONNECTION_ID
##### CONV
##### CONVERT
##### CURRENT_USER
##### DATABASE
##### IF
##### IFNULL
##### ISNULL
##### LAST_INSERT_ID
##### NULLIF
##### SESSION_USER
##### SYSTEM_USER
##### USER
##### VERSION
### SQL Server Functions
#### SQL Server String Functions
##### ASCII
##### CHAR
##### CHARINDEX
##### CONCAT
##### Concat with +
##### CONCAT_WS
##### DATALENGTH
##### DIFFERENCE
##### FORMAT
##### LEFT
##### LEN
##### LOWER
##### TRIM
##### NCHAR
##### PATINDEX
##### QUOTENAME
##### REPLACE
##### REPLICATE
##### REVERSE
##### RIGHT
##### RTRIM
##### SOUNDEX
##### SPACE
##### STR
##### STUFF
##### SUBSTRING
##### TRANSLATE
##### TRIM
##### UNICODE
##### UPPER
#### SQL Server Math/Numeric Functions
##### ABS
##### ACOS
##### ASIN
##### ATAN
##### ATN2
##### AVG
##### CEILING
##### COUNT
##### COS
##### COT
##### DEGREES
##### EXP
##### FLOOR
##### LOG
##### LOG10
##### MAX
##### MIN
##### PI
##### POWER
##### RADIANS
##### RAND
##### ROUND
##### SIGN
##### SIN
##### SQRT
##### SQUARE
##### SUM
##### TAN

#### SQL Server Date Functions
##### CURRENT_TIMESTAMP
##### DATEADD
##### DATEDIFF
##### DATEFROMPARTS
##### DATENAME
##### DATEPART
##### DAY
##### GETDATE
##### GETUTCDATE
##### ISDATE
##### MONTH
##### SYSDATETIME
##### YEAR
#### SQL Server Advanced Functions
##### CAST
##### COALESCE
##### CONVERT
##### CURRENT_USER
##### IIF
##### ISNULL
##### ISNUMERIC
##### NULLIF
##### SESSION_USER
##### SESSIONPROPERTY
##### SYSTEM_USER
##### USER_NAME
### MS Access Functions
#### MS Access String Functions
##### Asc
##### Chr
##### Concat with &
##### CurDir
##### Format
##### InStr
##### InstrRev
##### LCase
##### Left
##### Len
##### LTrim
##### Mid
##### Replace
##### Right
##### RTrim
##### Space
##### Split
##### Str
##### StrComp
##### StrConv
##### StrReverse
##### Trim
##### UCase

#### MS Access Numeric Functions
##### Abs
##### Atn
##### Avg
##### Cos
##### Count
##### Exp
##### Fix
##### Format
##### Int
##### Max
##### Min
##### Randomize
##### Rnd
##### Round
##### Sgn
##### Sgr
##### Sum
##### Val
#### MS Access Date Functions
##### Date
##### DateAdd
##### DateDiff
##### DatePart
##### DateSerial
##### DateValue
##### Day
##### Format
##### Hour
##### Minute
##### Month
##### MonthName
##### Now
##### Second
##### Time
##### TimeSerial
##### TimeValue
##### Weekday
##### WeekdayName
##### Year
#### MS Access Some Other Functions
##### CurrentUser
##### Environ
##### IsDate
##### IsNull
##### IsNumeric

### SQL Quick Ref
## SQL Examples
### SQL Examples
### SQL Editor
### SQL Quiz
### SQL Exercises
### SQL Server
### SQL Syllabus
### SQL Study Plan
### SQL Bootcamp
### SQL Certificate

## References

[^1]: Google's Search Labs | AI Overview