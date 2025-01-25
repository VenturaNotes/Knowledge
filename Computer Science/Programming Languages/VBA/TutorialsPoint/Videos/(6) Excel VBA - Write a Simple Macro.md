---
Source:
  - https://www.youtube.com/watch?v=PoIVp9VWo4I
Reviewed: false
---
- ![[Screenshot 2025-01-25 at 3.06.23 AM.png|500]]
	- To open editor, "Developer" $\to$ "Visual Basic"
	- Module editor has the code for the recording we did in a previous video
	- To create a simple macro, first create a module
	- If you want to write a macro, any coding part 
	- Any coding part can be written in a sub procedure
	- Whenever you write text, you have to write in double quotes
	- To run code, you need to keep cursor between `Sub` and `End Sub`
	- Then we get the dialog box that is known as `MsgBox`
```VBA
Sub first_Macro()

MsgBox "TutorialsPoint"

MsgBox 100

End Sub
```
- The above will display a message box with "TutorialsPoint" first and then when that's closed, will display `100`