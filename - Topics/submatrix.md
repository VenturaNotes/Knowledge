---
aliases:
  - submatrices
---
## Synthesis
- 
## Source [^1]
- Submatrix of a given matrix, A. Any matrix derived from A by deleting one or more of its columns and/or one or more of its rows. See also TRIM
## Source[^2]
- A submatrix `(x1, y1, x2, y2)` is a matrix that forms by choosing all cells `matrix[x][y]` where `x1 <= x <= x2` and `y1 <= y <= y2`
### #comment 
- So a submatrix `(x1, y1, x2, y2)` is defined as a rectangular block of cells within a larger matrix
	- It includes all cells `matrix[x][y]` where 
		- the row index `x` is between `x1` and `x2` inclusive
		- the column index `y` is between `y1` and `y2` inclusive
	- So the top-left corner is `(x1, y1)` and the bottom-right corner is `(x2, y2)`
#### Example
- Given a 3x4 matrix
	- $A = \begin{pmatrix}1 & 2 & 3 & 4 \\5 & 6 & 7 & 8 \\9 & 10 & 11 & 12\end{pmatrix}$
		- A submatrix could be $\begin{pmatrix}2 & 3 \\6 & 7\end{pmatrix}$
			- Given `(x1, y1, x2, y2)`
			- Assign the variables (0-indexed)
				- Top-left corner = 2
					- `x1=0` (first row)
					- `y1=1` (second column)
				- Bottom-right corner = 7
					- `x2=1` (second row)
					- `y2=2`  (third column)
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: https://leetcode.com/problems/count-submatrices-with-equal-frequency-of-x-and-y/description/?envType=daily-question&envId=2026-04-21