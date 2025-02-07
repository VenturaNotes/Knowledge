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
	- IN
		- To specify multiple possible values for a column
### SQL Order By
### SQL And
### SQL Or
### SQL Not
### SQL Insert Into
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

