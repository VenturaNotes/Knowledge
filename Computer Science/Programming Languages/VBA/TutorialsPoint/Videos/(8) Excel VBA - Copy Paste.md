---
Source:
  - https://www.youtube.com/watch?v=HkFVkodBBXA
Reviewed: false
---
- ![[Screenshot 2025-01-25 at 3.53.18 AM.png]]
	- How to copy and paste from one cell to another cell
	- The `CutCopyMode = False` will make whatever is selected to be deselected
```VBA
Sub first_Macro()

Range("a1:a10") = "Tutorials"

'1st Method
Range("b1:b10") = Range("a1:a10").Value

'2nd Method
Range("a1:a10").Copy
Range("d1:d10").PasteSpecial
Application.CutCopyMode = False

End Sub
```
Result
![[Screenshot 2025-01-25 at 3.30.01 AM.png|300]]