---
Source:
  - https://youtube.com/watch?v=SEh3yhEFK1w
Reviewed: true
---
- ![[Screenshot 2024-01-30 at 9.26.17 AM.png]]
	- 3 [[Gaussian operations|row operations]]
		- [[Replacement]]
			- Replace one row by the sum of itself and a multiple of another row
				- The definition here is not necessarily the best. You can also find the multiple of the row that you are replacing
				- You can use multiples of either row to do this.
				- $-2R_2 + R_1 \to R_2$
					- Read as "Negative Two Times Row Two Added to Row 1 Targets Row 2"
				- the $\rightarrow$ could mean "gives" or "targets" maybe?
		- [[Interchange]]
			- Interchange (swap) two rows
				- "Helpful for achieving maximum number of zeros. Helps visually "[^1]
		- [[Scaling]]
			- Multiply a row by a non-zero constant
				- Division is not one of the row operations
				- Must say "half" of row 1
	- Solve the system (again)
		- This time use an [[augmented matrix]] and row operations
		- We would like all the diagonal down-right values to be 1s (Green). The other values (above or below the diagonal line) should be 0s
		- The numbers in red surrounded by the white line is know as [[triangular form]].
			- Quite often we don't have all ones there (just the zeros are important)
				- This is known as Gaussian elimination
			- [[Gauss Jordan elimination]] is when you turn the numbers above the triangular form to 0
		- Could just use [[back-substitution]] from here (shown in white)
		- You could alternatively keep using row operations until you've solved the system
- ![[Screenshot 2024-01-30 at 9.32.55 AM.png]]
	- [[Existence]] and [[Uniqueness]]
		- Determine if the system is consistent (does a solution exist?) If so, determine if the solution is unique (just one solution?)
		- Because $0x_1 + 0x_2 + 0x_3 = 15$ has no solution, the system is inconsistent. Therefore, we can't check if the solution is unique.
	- Practice
		- Solve the system using row operations and aug. matrices
			- You could do two operations in the same step
			- The solution is given as an [[ordered triple]] (1,0,-1)

## References
[^1]: Ayushe Gangal