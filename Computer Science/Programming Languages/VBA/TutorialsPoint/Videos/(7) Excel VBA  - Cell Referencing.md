---
Source:
  - https://www.youtube.com/watch?v=IzE9GDf1VGE
Reviewed: false
---
- ![[Screenshot 2025-01-25 at 3.20.26 AM.png]]
	- If you want to understand step by step execution, use the debug menu bar or use step into
	- To get the debug toolbar, 
		- "View" $\to$ "Toolbars" $\to$ "Debug"
			- To see step by step execution, click the "Step Into" button
				- Could just use F8 on keyboard as well
			- The yellow highlight shows the line that will be executed
	- `ActiveCell.value = 40` 
		- will set the value of the currently active cell to 40
	- `[b5].Value = 70`
		- Will set value of cell `b5` to 70
	- `[c1:c10] = "Tutorials"`
		- Will give range of values to fill cells with "Tutorials"
	- `Cells(8,2).Value = "India"`
		- Also widely used method
			- Used for continuous for loop, if conditional 
				- If loop?
		- Shows row 8 and column 2
			- Which is equivalent to B8
	- `Range("a1").Value = Mumbai`
		- This method is used widely across
		- First most used method
		- Changes value of one cell
	- `Range("a2:a10") = "Jakarta"`
		- Gives entire range
	- Learned how to refer cells or how to write values into excel sheet cells
```VBA
Sub first_Macro()

ActiveCell.Value = "tutorials"

ActiveCell.Value = 40

[b5].Value = 70
[c1:c10] = "Tutorials"

Cells(8, 2).Value = "India"

Range("a1").Value = "Mumbai"

Range("a2:a10") = "Jakarta"


End Sub
```