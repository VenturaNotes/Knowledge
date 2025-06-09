---
aliases:
  - Structured Query Language
---
## Synthesis
- 
## Source [^1]
- A standard language for storing, manipulating, and retrieving data in databases
	- #question How can you store, manipulate, and retrieve this data?
- Stands for "structured query language"
- Lets you access and manipulate databases

## Source[^2]
### Order Of Execution
- SQL queries adhere to a specific order when evaluating clauses
- Queries aren't read from top to bottom when carried out
- The order in which the clauses in queries are executed is as follows
	- (1) FROM/JOIN
		- Executed first to determine the data of interest
	- (2) WHERE
		- Filters out records that do not meet constraints
	- (3) GROUP BY
		- Groups data based on values in one or more columns
	- (4) HAVING
		- Removes the created grouped records that don't meet the constraints
	- (5) SELECT
		- Derive all desired columns and expressions
	- (6) ORDER BY
		- Sort derived values in ascending or descending order
	- (7) LIMIT / OFFSET
		- Keep or skip a specified number of rows

## Source[^3]
- A domain-specific language used in programming for managing and manipulating relational databases.

## Source[^4]
- (Formerly known as SEQUEL, acronym for Structured English Query Language) The de facto standard language for database access and update for relational database management systems. See feature SQL.
### SQL
- SQL (structured query language) is the de facto standard language for interrogating and managing relational databases. Originally developed by IBM in 1974, it was standardized by ANSI in 1986 and subsequently by ISO. The latest comprehensive version is SQL 2003, with some parts being modified in 2006. SQL is employed in a large number of database management systems, including SQL Server, mySQL, postgreSQL, and Oracle.
### Basic operations
- SQL is built upon four types of operation (called queries in SQL terminology):
	- Select, which retrieves records from the database;
	- Insert, which adds new records to the database;
	- Update, which amends existing records in the database;
	- Delete, which removes records from the database.
### Selecting data
- The select operation is the most important one used in SQL, used to obtain different sorts of information. Consider a database that has a table called 'data' containing information about employment. The rows are the records in the database and the columns are the fields. In this example the fields are 'name,' 'occupation,' 'salary,' and 'city.' A simple select query is:
```SQL
select *
from data
```
- This query retrieves all fields ('') from all rows in the table called 'data': that is, it retrieves the whole table. The fields to be retrieved can be limited:
```SQL
select name, salary
from data
```
- This query retrieves just the 'name' and the 'salary' columns for all records. It is also possible to use conditional queries limiting the information obtained for both records and fields, for example:
```SQL
select name, salary
from data
where occupation = 'dentist'
```
- This query retrieves only those rows where the field called 'occupation' contains the value 'dentist'; and, from those rows, it retrieves only the fields 'name' and 'salary.'
### Summarizing data
- Data from multiple rows can be summarized (aggregated, in SQL terminology) and calculations can be performed on numerical data:
```SQL
select occupation, avg(salary)
from data
group by occupation
```
- This query retrieves all records and divides them into groups according to the value of the field 'occupation.' It calculates the mean value of the 'salary' field for all rows in each group and returns one row for each group containing two fields: the grouping field, 'occupation'; and the calculated mean salary of the group. In other words, it produces a list of occupations and the average salary for each occupation. A further restriction to workers in a particular city can be applied using a 'where' clause:
```SQL
select occupation, avg(salary)
from data
where city = 'Chicago'
group by occupation
```
### Multiple tables
- The real power of SQL lies in the 'from' clause, which can retrieve data from several tables:
```SQL
select data.occupation, avg(data.salary)
from data join cities on data.city = cities.city
where cities.state = 'Illinois'
group by data.occupation
```
- This query assumes that the tables 'data' and 'cities' both have a column called 'city' that can act as a cross-reference (a foreign key, in SQL terminology). It first combines$\textemdash$joins, in SQL terminology$\textemdash$these two tables to construct a pseudotable. In this, one row is generated for every possible combination of rows from the two tables where the values of the 'city' fields are equal; each such row contains all fields from both tables. This pseudotable is then used to perform the aggregation in a similar fashion to the example given above.
### Changing data
#### Insert queries
- Insert queries work in either of two ways. Rows can be selected from one table or joined set of tables and inserted into another:
```SQL
insert into summaryIllinois(occupation, avgSalary)
select data.occupation, avg(data.salary)
from data join cities on data.city = cities.city
where cities.state = 'Illinois'
group by data.occupation
```
- This query adds the results of the example given above to the table 'summaryIllinois.' Alternatively, insert queries can add one row of arbitrary values to a table:
```SQL
insert into data(name, occupation, city)
values('Dave', 'doctor', 'New York')
```
- This query adds one row to the table 'data,' with the three fields named receiving the given values.
#### Update queries
- Update queries use values generated by SQL expressions to alter the values of specified fields in specified rows in a specified table:
```SQL
update data set
salary = data.salary * 1.1
from data join cities on data.city = cities.city
where cities.state = 'Illinois'
and data.occupation = 'dentist'
```
- This query updates the 'data' table to reflect a $10 \%$ salary increase for all dentists in Illinois.
#### Delete queries
- Delete queries work in a similar way to update queries:
```SQL
delete data
from data join cities on data.city = cities.city
where cities.state = 'New York'
and data.occupation = 'doctor'
```
- This query deletes all rows from the 'data' table relating to doctors in New York.
### Note
- This outline of SQL has only scratched the surface of the language. The SQL standard is many hundreds of pages long and there are also several standard extensions to increase functionality (e.g. the use of Java within SQL). Moreover individual commercial database developers usually have their own versions of SQL.
## Source[^5]
- A programming language for storing and processing information in a [[relational database]]

## Source[^6]
- SQL is a programming language used by developers to manage data in relational database management systems. It is a simple query language and is often easier to learn than other programming languages such as Java. Roles that often require SQL skills include data scientists, database mitigation engineers, and database administrators.
## References

[^1]: [[Home Page - SQL Tutorial by W3Schools]]
[^2]: https://builtin.com/data-science/sql-order-of-execution
[^3]: https://spdload.com/blog/software-development-glossary/
[^4]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^5]: [[Home Page - System Design Daily by David Zhang]]
[^6]: [[Home Page - Glossary by Capterra]]