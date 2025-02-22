## Synthesis
- 
## Source [^1]
- Specifies which table to select or delete data from
### Examples
#### Selecting Specific Columns
```SQL
SELECT CustomerName, City FROM Customers;
```
- Shows two columns "CustomerName" and "City" from the table "Customers"
	- ![[Screenshot 2025-02-21 at 2.37.28 PM.png]]
#### Selecting All Columns
```SQL
SELECT * FROM Customers;
```
- This would basically return the same table as it selects all columns from the "Customers" table
#### Deleting Rows from Original Table
```SQL
DELETE FROM Customers
WHERE CustomerName='Alfreds Futterkiste';
```
- This modifies the original table "Customers" and permanently removes the row(s) that match the condition of a CustomerName holding the value 'Alfreds Futterkiste'[^2]
## References

[^1]: https://www.w3schools.com/sql/sql_ref_from.asp#:~:text=The%20FROM%20command%20is%20used,select%20or%20delete%20data%20from.
[^2]: ChatGPT