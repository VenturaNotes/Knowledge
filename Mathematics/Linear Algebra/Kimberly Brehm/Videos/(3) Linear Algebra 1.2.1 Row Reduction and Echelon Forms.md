---
Source:
  - https://youtube.com/watch?v=7xtAYrAtuPc
Reviewed: true
---
- ![[Screenshot 2024-12-09 at 8.46.55 AM.png]]
	- First
		- Row Reduction and Echelon Forms
			- Started to work with row operations and matrices
		- [[Echelon Form]] vs. [[Reduced Row Echelon Form]] (RREF or REF)
			- Echelon: (Previously called triangle form)
			- (1) All non-zero rows are above all zero rows
			- (2) Each leading entry of a row is in a column to the right of the leading entry of the row above it
			- (3) All entries in a column below a leading entry are zeros
			- RREF - ALL conditions above and!
			- (4) The leading entry in each non-zero row is 1
			- (5) Each leading 1 is the only non-zero entry in the column
				- You can still have an all zero row
		- REF simply stands for "reduced echelon form"
	- Second
		- [[Pivot]]! (terminology that tells us we're looking at [[leading coefficient]] in row)
			- [[Pivot position]]: Corresponds to leading 1 in RREF
			- [[Pivot column]]: The column that contains the pivot
			- [[Pivot]]: Nonzero number in pivot position used to create zeros in row operations
	- Third
		- The [[Row Reduction Algorithm]] (gives steps to follow in the easiest and fastest way possible)
			- (1) Begin at leftmost nonzero column, which is a pivot column. Select a nonzero entry as pivot and interchange, If necessary, to move that entry into the pivot position (row 1)
				-  Obviously write as [[Augmented Matrix]] first
	- Fourth
		- The Row Reduction Algorithm
			- (2) Use row operations to create zeros in all entries below the pivot
- ![[Screenshot 2024-12-09 at 10.39.01 AM.png]]
	- The Row Reduction Algorithm
		- (3) Repeat this process for remaining rows, ignoring rows you've already applied algorithm to
		- If we stop the algorithm after doing $\frac {-2}{5}R_3 \to R_3$, then we would end up with a [[back-substitution]] situation, but we want RREF
	- The Row Reduction Algorithm
		- (4) Ensure each pivot is a 1, using scaling as necessary
	- The Row Reduction Algorithm
		- (5) Beginning with the rightmost pivot and working upwards and to the left, use row operations to create zeros above each pivot
		- Found solution to be (5, 3, -1)