---
Source:
  - https://www.youtube.com/watch?v=5pp1r1sQKtg
Reviewed: false
---
- ![[Screenshot 2025-01-25 at 4.04.47 AM.png]]
	- There are 8 types of colors in VB macros. 8 standard colors
		- `vbGreen` is green
	- Weight is maximum 4
	- There are many LineStyles such as
		- xlDot
			- Dotted line
		- xlDash
			- Dashed line
		- xlContinuous
			- Continuous line
		- xlDouble
		- xlNone
			- Will remove all lines (all borders)
```VBA
Sub borders()

Range("a1:a10").borders.LineStyle = xlDot
Range("a1:a10").borders.Color = vbGreen
Range("a1:a10").borders.Weight = 3

Range("a1:a10").borders.LineStyle = xlDot
Range("a1:a10").borders.LineStyle = xlDash
Range("a1:a10").borders.LineStyle = xlContinuous
Range("a1:a10").borders.LineStyle = xlDouble
Range("a1:a10").borders.LineStyle = xlNone

End Sub
```

Result for each step in order
![[Screenshot 2025-01-25 at 4.03.14 AM.png]]