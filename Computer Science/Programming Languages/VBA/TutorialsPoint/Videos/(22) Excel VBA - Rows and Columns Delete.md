---
Source:
  - https://www.youtube.com/watch?v=ykXfSmEr2OA
Reviewed: false
---
- ![[Screenshot 2025-01-30 at 6.44.31 AM.png]]
	- Can right-click column and press delete manually. Same works for row
	- All commands written in the sub-procedure
```VBA
Sub delete_row_column()

'This deletes 5th row
Range("c5").EntireRow.Delete

'Starting 3 rows deleted
Range("a1:a3").EntireRow.Delete

'Deletes colum c
Range("c5").EntireColumn.Delete

'Deletes columns a, b, and c
Range("a1:c1").EntireColumn.Delete

End Sub
```
