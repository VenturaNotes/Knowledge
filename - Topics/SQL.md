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
## References

[^1]: [[Home Page - SQL Tutorial by W3Schools]]
[^2]: https://builtin.com/data-science/sql-order-of-execution
[^3]: https://spdload.com/blog/software-development-glossary/