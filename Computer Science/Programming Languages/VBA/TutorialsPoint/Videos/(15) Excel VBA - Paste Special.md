---
Source:
  - https://www.youtube.com/watch?v=dxZOyl33700
Reviewed: false
---
- ![[Screenshot 2025-01-25 at 4.31.57 AM.png|500]]
	- Paste special needed to paste format
	- Would typically right click "Paste Special" $\to$ and then given a dialog box
		- Could just paste formats into another cell for example
	- There is a clipboard button in top-left of excel window that lets you see what you have copied
	- The code pastes the formats, column widths and values
	- Then deselects with CutCopyMode
```VBA
Sub pastespecial()

Range("a1:a10").Copy

Range("b1:b10").pastespecial xlPasteFormats
Range("b1:b10").pastespecial xlPasteColumnWidths
Range("c1:c10").pastespecial xlPasteValues

Application.CutCopyMode = False

End Sub
```
Result
![[Screenshot 2025-01-25 at 4.33.21 AM.png]]