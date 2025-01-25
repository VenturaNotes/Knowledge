---
Source:
  - https://www.youtube.com/watch?v=Z5knhyubmEk
Reviewed: false
---
- ![[Screenshot 2025-01-25 at 3.38.09 AM.png]]
	- In `Range("a1:10").Font`
		- `Font` is just an object of `Range()`
	- In `Range("a1:10").Font.Bold = True`
		- Makes it bold
	- In `Range("a1:10").Font.Italic`
		- Makes it italic
	- In `Range("a1:10").Font.Name = "Arial"`
		- Changes name of font
	- Can change size of font 
	- Seems like pressing Control + Backspace will just delete line without moving cursor from line in module of VBA editor
	- Able to add underline and remove underline
```VBA
Sub font()

Range("a1:a10") = "Tutorials"

Range("a1:a10").font.Name = "Arial"
Range("a1:a10").font.Bold = True

Range("a1:a10").font.Size = 20

Range("a1:a10").font.Name = "Algerian"
Range("a1:a10").font.Name = "Arial"

Range("a1:a10").font.Size = 20
Range("a1:a10").font.Bold = True
Range("a1:a10").font.Bold = False

Range("a1:a10").font.Italic = True
Range("a1:a10").font.Italic = False

Range("a1:a10").font.Underline = True
Range("a1:a10").font.Underline = False

Range("a1:a10").font.Strikethrough = True
Range("a1:a10").font.Strikethrough = False

End Sub
```