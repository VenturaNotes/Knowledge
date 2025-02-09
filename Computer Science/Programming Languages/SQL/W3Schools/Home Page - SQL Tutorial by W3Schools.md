---
Source:
  - https://www.w3schools.com/sql/default.asp
Length: "77"
tags:
  - status/incomplete
  - type/website
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
- Can combine "AND" and OR (found [[Home Page - SQL Tutorial by W3Schools#^sy1rb1|here]] )

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

### SQL Update
### SQL Delete
### SQL Select Top
### SQL Aggregate Functions
### SQL Min and Max
### SQL Count
### SQL Sum
### SQL Avg
### SQL Like
### SQL Wildcards
### SQL In
### SQL Between
### SQL Aliases
### SQL Joins
### SQL Inner Join
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
### MySQL Functions
### SQL Server Functions
### MS Access Functions
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

