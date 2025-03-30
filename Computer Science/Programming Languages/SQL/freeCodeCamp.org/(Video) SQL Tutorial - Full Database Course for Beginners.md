---
Source:
  - https://www.youtube.com/watch?v=HXV3zeQKqGY
Length: 4 hours, 29 minutes, 38 seconds
tags:
  - status/incomplete
  - type/video
Reviewed: false
---
### Introduction
- [[SQL]] is a language which is used to interact with relational database management systems.
	- [[relational database|relational database management system]] is a software application which we can use to create and manage different databases.
- Basics
	- What is a [[database]]?
		- types of databases
	- what sql is and what it actually means
	- How you can use it to create databases
- Will install a relational database management system (software we can use to manage a database)
- We'll install a relational database management system call MySQL
	- Most popular with beginners and in general
- We'll write SQL code
	- queries to create databases and database tables
		- input information
		- retrieve information
- We'll write SQL queriers
	- queries are used to query a database
	- Create a database, populate it with information
		- learn how to write SQL queriers to get specific pieces of information
		- Will learn fundamentals + advanced techniques to get information out of a database
	- How to design database schemas
		- all different tables and relations that database is going to store
- Course covers all of SQL, fundamentals that we need to get started. Database design and schema design
- SQL is one of the most popular languages for jobs and developers

### What is a database?
(DB is a common abbreviation for database) 
- What is a Database (DB):
	- Any collection of related information
		- phone book
			- stores numbers
		- shopping list
		- todo list
			- stores what you want to do
		- Your 5 best friends
			- stored this in head
		- Facebook's User Base
			- stores users
	- Databases can be stored in different ways
		- On paper
			- write it on paper
		- In your mind
			- know that in your mind naturally
		- On a computer
			- most common use-case
		- This powerpoint
			- related information on it to teach lesson
		- Comments section
			- storing comments for video

- Computers + Databases = <3
	- Amazon.com
		- Keeps track of Products, Reviews, Purchase Orders, Credit Cards, Users, Media, etc.
		- Trillions of pieces of information need to be stored and readily available
		- Information is extremely valuable and critical to Amazon.com's functioning
		- Security is essential, Amazon stores peoples personal information
			- Credit card #, SSN, Address, phone
		- Information is stored on a computer
	- VS
	- Shopping List
		- Keeps track of consumer products that need to be purchased
		- 10-20 pieces of information need to be stored and readily available
		- Information is for convenience sake only and not necessary for shopping
		- Security is not important
		- Information is stored on a piece of paper, or even just in someone's memory
	- <mark style="background: #FFF3A3A6;">Computers are great at keeping track of large amounts of information</mark>

Database does not need to be just on a computer

- Database Management Systems (DBMS)
	- A special software program that helps users create and maintain a database
		- Makes it easy to manage large amounts of information
			- Makes it easy to manage Amazon's trillions of information
		- Handles Security
			- Only allows certain people to access the data
		- Backups
		- Importing/exporting data
			- from other sources
		- Concurrency
			- concurrent access (meaning 'at the same time') to the same database by multiple users [^1]
		- Interacts with software applications
			- Programming Languages
			- You can write a program to interact with the database management system
			- Amazon.com is a website and it's interacting with the Amazon database which is stored most likely using a database management system

Database could be as simple as a text file where you store information or an Excel file (.xls) [^2]

Amazon.com Database Diagram
![[Screenshot 2022-11-21 at 1.49.53 PM.png|600]]
- Amazon.com will interact with the DBMS in order to create, read, update and delete information
	- Amazon is not creating the information directly. It's telling the DBMS to do it for it.
	- By going through DBMS, we can ensure that the data is being stored correctly and no problems with data
- Amazon is communicating with a database management system
- The DBMS (database management system) is creating and storing and keeping track of a database. 
- The DBMS is not the actual database. The DBMS is the software application that is creating/maintaining/updating/deleting information from the actual database. 


- C.R.U.D (core 4 operations that we want the DBMS to perform for us)
	- Create, Read, Update, Delete (or Create, Retrieve, Update, Delete)
	- Any good DBMS will be able to do all 4 of these things

- C.R.U.D represents the 4 main operations in a database.
	- Will create information in the database
		- Creating new database entries
	- Will read information from the database
		- retrieving or getting information already stored in there
	- Updating existing information
	- Deleting the information already in there

- Two Types of Databases
	- Relational Databases (SQL) (pronounced S-Q-L spelled out or "sequel")
		- By far the most popular type of database
			- Will organize the data inside predefined tables
			- Then insert information into there
		- A lot like an Excel spreadsheet
		- Organize data into one or more tables
			- Each table has columns and rows
			- A unique key identifies each row
	- Non-Relational (noSQL / not just SQL)
		- Organize data is anything but a traditional table
		- A very general category. Anything that is not relational
			- key-value stores
			- Documents (JSON, XML, etc)
				- JSON is JavaScript Object Notation
			- Graphs
			- Flexible Tables

- Relational Databases (SQL)


Student Table:

| \*ID# | Name   | Major     |
| ----- | ------ | --------- |
| 1     | Jack   | Biology   |
| 2     | Kate   | Sociology |
| 3     | Claire | English   |
| 4     | John   | Chemistry          |

The ID will uniquely identify the row in the table

Users Table:

| \*Username | Password | Email |
| ---------- | -------- | ----- |
| jsmith22   | wordpass | ...   |
| catlover45 | apple223 | ...   |
| gamerkid   | ...      | ...   |
| giraffe    | ...      | ...      |

Username will be something unique as well

- Relational Databases (SQL)
	- Relational Database Management Systems (RDBMS)
		- Help users create and maintain a relational database
			- mySQL, Oracle, postgreSQL, mariaDB, etc.
				- (PostgreSQL is proper way of writing it?)
	- Structured Query Language (SQL)
		- Standardized language for interacting with RDBMS
		- Used to perform C.R.U.D operations, as well as other administrative tasks (user management, security, backup, etc).
		- Used to define tables and structures
		- SQL code used on one RDBMS is not always portable to another without modification

RDBMS is a software application that we can use to create, maintain and do different things to our relational database

Non-Relational Databases (noSQL / not just SQL)

1. ![[Screenshot 2022-11-21 at 2.21.43 PM.png]]
- Document
	- JSON, BLOB, XML, etc..)

2. ![[Screenshot 2022-11-21 at 2.21.59 PM.png|600]]
- Graph
	- Relational nodes

3. ![[Screenshot 2022-11-21 at 2.22.58 PM.png]]
- Key-Value Hash
	- Keys are mapped to values
		- (strings, json, blob, etc...)

Non-Relational Databases (noSQL / not just SQL)
- Non-Relational Database Management Systems (NRDBMS)
	- Help users create and maintain a non-relational database
		- mongoDB, dynamoDB, apache cassandra, firebase, etc
- Implementation Specific
	- Any non-relational database falls under this category, so there's no set language standard.
	- Most NRDMBS will implement their own language for performing C.R.U.D and administrative operations on the database

Database Queries
- Queries are requests made to the database management system for specific information
- As the database's structure become more and more complex, it becomes more difficult to get the specific pieces of information we want.
	- If we have a complex layout or schema, getting a specific piece of information can get tricky
		- That's why we write database queries
			- We can write a very complex database query, and that query will then instruct the relational database management system to grab a specific piece or specific pieces of information from the database
- A google search is a query

With RDBMS, we have to wire our queries using either SQL or a specific language that's meant for that database management system

Wrap Up
- Database is any collection of related information
- Computer are great for storing databases
	- computers are fast and can handle things such as security very easily
- Database Management Systems (DBMS) make it easy to create, maintain and secure a database
- DBMS allow you to perform the C.R.U.D operations and other administrative tasks
- Two types of Databases, Relational & Non-Relational
- Relational databases use SQL and store data in tables with rows and columns
- Non-Relational data store data using other data structures
- A query is just a request that you would make to the database management system for a specific piece of information

 Will learn how to create databases, how to store them, and how to organize so that it's easier to retrieve when we want it

### Tables & Keys
![[Screenshot 2022-11-21 at 2.54.38 PM.png|300]]
- Student table defines specific information about a student.
- Column names are student_id, name, and major
	- Storing 3 pieces of information about each student
	- A column would define a single attribute
	- A row is an individual entry inside the student table
	- We always want one very special column called the [[primary key]]
		- A primary key is an attribute which uniquely defines the row in the database
		- It's an attribute about a specific entry 
		- The <mark style="background: #FFF3A3A6;">student_id</mark> is the <mark style="background: #FFF3A3A6;">primary key</mark>.
		- Kate's <mark style="background: #FFF3A3A6;">primary key</mark> is <mark style="background: #FFF3A3A6;">1</mark>
		- Primary keys come in handy because there are 2 students with the same name and major so you need a primary key to differentiate them.
			- The whole point of a primary key is that it will be unique in the table for each row. Even if all the attributes of a row are the same, the primary key won't be
				- Therefore, we can differentiate between the rows
				- student_id cannot 
					- 1 for row 2 and 1 for row 3
		- A primary key can be anything
			- Number
			- String of text
![[Screenshot 2022-11-21 at 2.55.15 PM 2.png|400]]
- Email will be the primary key
- Emails are unique to each entry of the table
	- We'll define a table and then insert specific pieces of information into that table
![[Screenshot 2022-11-21 at 2.55.34 PM 2.png|400]]
- Company database where we're storing information about employees
- This employee ID is what we call a [[surrogate key]]
	- A key that has no mapping to anything in the real world
		- Like in this case, a random number that we assign to an employee
	- A type of a primary key
![[Screenshot 2022-11-21 at 3.00.28 PM.png]]
- SSN stands for social security number (used in the United States in order to uniquely identify each citizen)
- We're using SSN to uniquely identify each row in the table. Using SSN as primary key of table
	- This is an example of a [[natural key]]
		- It's a key that has a mapping or a purpose in the real world. Not just our database
- 2 types of <mark style="background: #FFF3A3A6;">primary keys</mark>
	- [[Surrogate key]] is a primary key that has no mapping to the real world
	- [[Natural key]] is a key that has a mapping to the real world like an SSN

![[Screenshot 2022-11-21 at 3.23.05 PM.png]]
- [[Foreign key]]
	- Attribute that we can store on a database table that will link us to another database table
	- branch_id is a foreign key
	- A foreign key stores the primary key of a row in another database table
	- We can store a branch that an employee belongs to inside a foreign key (branch_id)
	- A foreign key is a primary key inside of another table (in our case, the branch table)
- The branch has a primary key of 2, 3, and 1
	- We can define which branch a specific employee belongs to by referring tothe ID, the primary key of the branch
	- For example, Jan has a branch_id of 1 meaning she's in the Corporate branch
- A foreign key is a way we can define relationships between the 2 tables
	- foreign key is a primary key of another table
- On the branch table, we have a foreign key called "mgr_id" or manager ID. It's a foreign key that connects "Branch" to the "Employee" table
	- Manager ID is going to be the ID of a particular employee who is the manager of the branch
		- So because mgr_id is 101 for Michael Scott, he is the manager of the Scranton branch
			- We're able to define that relationship using the foreign keys
- Foreign key tells us the relationship between tables
![[Screenshot 2022-11-21 at 3.34.36 PM.png]]
- A particular table can have more than 1 foreign key on it.
- Another attribute/column was added to the far-right.
- super_id = supervisor ID
	- Tells us the supervisor of employee
		- What's cool about this key is that it relates back to the same table
			- So an employee can be the supervisor of another employee
			- Example: Angela has a super_id of 101 which means her supervisor is Michael Scott who has an emp_id of 101.
	- This foreign key defines relationships between employees
		- Before we did employee table vs branch table
		- Now we're doing employee table with employee table

![[Screenshot 2022-11-21 at 3.46.47 PM.png]]
- Branch Supplier defines who the suppliers are for specific branches
- The primary key consists of 2 columns (would be called [[composite key]])
- [[Composite key]] is a key that is made up of 2 attributes (columns)
	- branch_id is going to refer to the specific branch and supplier_name is going to refer to the specific supplier
		- For example, Hammer Mill supplies paper to branch #2
- Inside branch supplier table, able to define which different suppliers are supplying what to which different branches
- The reason we need the composite key is because the supplier name does not uniquely identify each row and the branch_id doesn't uniquely identify each row.
	- Only together can they uniquely identify each row. The columns have repeated values. Only together can they uniquely identify.
	- Hammer Mill supplies branch 2 is a combination that only shows up once
- In branch table, we only defined one column as the primary key and in the branch supplier, we've identified 2 branches as the primary key (composite key) that is, two columns uniquely identifying each row

![[Screenshot 2022-11-21 at 3.48.05 PM.png]]
- A client is like a customer which would buy paper products from the branch and employee
- "branch_id" is a foreign key for the client
	- So client will be associated with a specific branch
	- Example: FedEx will buy from branch 3 which is the Stamford branch
- Works_With table is defining relationships between the employees and the clients, namely how much paper an employee sells to a specific client
	- Example, emp_id 101 (Michael Scott) has sold to client_id 401 (Lackawana Country) $267,000 worth of product
- We have a composite key (employee ID and client ID)
	- Special type of composite key because both columns are foreign keys
	- Both of those foreign keys together makes up the primary key of the Works_With table
	- Useful way to define primary key
		- Can define how much product the client has bought from the employee (great relationship)
- Can use primary keys and foreign keys to define different relationships
- Good introduction to how tables work

### SQL Basics
- Structured Query Language (SQL)
	- It is considered a programming language but not really in the traditional sense
	- SQL used to communicate with DBMS 
	- SQL is a language used for interacting with Relational Database Management Systems (RDBMS)
		- You can use SQL to get the RDBMS to do things for you
			- Create, retrieve, update & delete data
			- Create & manage databases
			- Design & create database tables
				- Define a database schema which would just be the overall table design
			- Perform administration tasks (security, user management, import/export, backup, etc)
	- SQL implementations vary between systems
		- Not all RDBMS' follow the SQL standard to a 'T'
		- The concepts are the same but the implementation may vary
		- Some examples of RDBMS
			- Postegres, MySQL, Oracle, Microsoft SQL Server
	- SQL is actually a hybrid language, it's basically 4 types of languages in one
		- [[Data Query Language]]
			- Used to query the database for information
			- Get information that is already stored there
		- [[Data Definition Language|Data Definition Language (DDL)]] 
			- Used for defining database schemas
				- A schema is an overall layout of the database such as what tables will be in the database, what columns those tables are going to have and the data types that those columns are going to be able to store. Can use SQL to define data in the different database schemas
		- [[Data Control Language]] (DCL)
			- Used for controlling access to the data in the database
			- User & permissions management
				- User could write to this table or read information from this table
		- [[Data Manipulation Language]]
			- Used for inserting, updating and deleting data from the database
- Queries
	- A query is a set of instructions given to the RDBMS (written in SQL) that tells the RDBMS what information you want it to retrieve for you
		- TONS of data in a DB
		- Often hidden in a complex schema
		- Goal is to only get the data you need
Example:
```SQL
SELECT employee.name, employee.age
FROM employee
WHERE employee.salary > 30000

```
The above will give us every employee in an employee table where their salary is greater than $30,000

### MySQL Windows Installation
- MySQL is a RDBMS
	- A software application used to maintain, create, etc. with databases.
	- We can set up a MySQL database server
		- A server where MySQL is running and we can write SQL in all sorts of queries and instructions to create and do stuff with databases
	- Download and install MySQL
- Download PopSQL
	- text editor that can hook up with MySQL database
	- Easy interface and easy way to write queries and get information back

Steps
- Search "mysql community server" on google
	- https://dev.mysql.com/downloads/mysql
	- It's a free and open source piece of software
	- Most basic version of MySQL we can use
	- You can download zip or the installer
- Download the MSI installer
- Accept license
- Go to Custom (because other stuff won't be part of course)
	- Get MySQL Server 5.7
	- Applications
		- MySQL Shell
			- MySQL Shell 1.0.11 - x64
- Click right arrow for next
- Standalone MySQL Server / Classic MySQL replication
- Leave Type and Networknig stuff as default
- When using MySQL database server
	- we'll need to login to it using an account
	- We have a default admin account setup for us called "Root"
		- We just need to set the password
- Make sure "Start the MySQL Server at System Startup" is checked
- Then do next + next + execute
- Go to "MySQL 5.7 Command Line Client" Terminal
- Enter password you created
	- Now you're connected to the MySQL server running on your computer
- Then type in `create database girrafe;`
	- Now database has been created
	- PopSQL helps us better visualize what is going on
		- It's a text editor which will connect to our database server
		- We'll be able to write our SQL from inside of there
- Go to https://popsql.io
	- Download for windows
	- It's like Google Docs but for writing SQL queries
	- Great way to visualize SQL queries that we're writing and what gets returned from those queries
- Sign in with Google account
- Connect to database inside PopSQL
	- Name: Giraffe
	- Type: MySQL
	- Hostname:localhost (refers to local address of the computer you're on)
	- Port: 3306 (assuming you used defaults when installing SQL)
	- Database: giraffe
	- Username: root
	- Password: (password you setup)
		- I ended up using qweasd12
- Now click Connect
	- We now have a text editor hooked up to our database
		- So we can write all of our SQL code and SQL queries in here
		- It will get run on MySQL database server

### MySQL Mac Installation
#### Section 1
- Steps
	- Type mysql community server on Google
		- https://dev.mysql.com/downloads/mysql
		- Here you can download MySQL Community Server
			- Great starting point
		- 400MB for file and at least 1GB of storage to hold everything that SQL is going to need
	- Install everything by default
		- You'll be given a password to login to the SQL server
		- Root is username
		- localhost is address of SQL server running on computer
		- MySQL is going to act like a little database server for us to connect to MySQL so we can login and manage the database from there.
	- Go to system settings
	- Go to terminal
	- Type this: `echo 'export PATH=/usr/local/mysql/bin:$path' >> ~/.bash_profile`
	- Then type `~/.bash_profile`
		- For me it said permission denied meaning it should be working for me?
		- The next step would be to type mysql and then say Access denied so who knows
	- The above doesn't work for MacBook Pro M1 so my solutions are shown below

#### Approach 1 (Fail)
Steps [^3]
- To see the list of available shells on your system
	- `ls -l /bin/*sh`
- Then go to terminal and type
	- `~ls -a`
- Make sure you can see `.zprofile`. If not, type
	- `touch .zprofile`
- Then type
	- `nano .zprofile`
- Then use the shortcut 
	- `Command + Shift + G`
- Type /usr and then open local -> mysql
- Right click on bin, hold option, and copy pathname from dropdown menu
- Then type into .zprofile:
	- `export PATH=${PATH}:<paste_what_you_copied>`
	- Doing `control + k` removes a line
- Do "control + o" to write, then press Enter
- Then press Control + X to exit
- Then type below to check if path successfully edited into profile
	- `cat .zprofile`

My .zprofile. Did not work when I just inserted the mysql path itself.

``` zprofile
# Setting PATH for Python 3.10
# The original version is saved in .zprofile.pysave
PATH="/Library/Frameworks/Python.framework/Versions/3.10/bin:${PATH}"
export PATH
eval "$(/opt/homebrew/bin/brew shellenv)"
export PATH=${PATH}:/usr/local/mysql-8.0.31-macos12-arm64/bin
```

#### Approach 2 (Fail)
- Reset computer

#### Approach 3 (Pass)
Steps [^4]
- Type `vi ~/.zshrc` into terminal
- insert `export PATH=${PATH}:/usr/local/mysql-8.0.31-macos12-arm64/bin`
	- - Type /usr and then open local -> mysql
	- Right click on bin, hold option, and copy pathname from dropdown menu
	- Then you have the path for above starting after `:`
- to write/save and close file, do escape + `:wq` + enter
- Then do `source ~/.zshrc` (Should work afterwards from there?)

#### Section 2

## References

[^1]: https://study.com/academy/lesson/what-is-a-database-management-system-purpose-and-function.html#:~:text=concurrency%3A%20concurrent%20access%20(meaning%20'at%20the%20same%20time')%20to%20the%20same%20database%20by%20multiple%20users
[^2]: https://learn.microsoft.com/en-us/deployoffice/compat/office-file-format-reference
[^3]: https://www.youtube.com/watch?v=oxToe-4c6OM
[^4]: https://stackoverflow.com/questions/69895619/mysql-command-is-not-found-in-m1-mac#:~:text=If%20not%20you,bin%2F%0Asource%20~%2F.zshrc