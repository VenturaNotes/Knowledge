## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-12-12 at 3.42.52 PM.png]]
- Gives steps to follow in the easiest and fastest way possible 
	- (1) Begin at leftmost nonzero column, which is a pivot column. Select a nonzero entry as pivot and interchange, If necessary, to move that entry into the pivot position (row 1)
	- (2) Use row operations to create zeros in all entries below the pivot
	- (3) Repeat this process for remaining rows, ignoring rows you've already applied algorithm to
		- We could use [[back-substitution]] here after  $\frac {-2}{5}R_3 \to R_3$, but we want [[Reduced Row Echelon Form|RREF]]
	- (4) Ensure each pivot is a 1, using scaling as necessary
	- (5) Beginning with the rightmost pivot and working upwards and to the left, use row operations to create zeros above each pivot
## References

[^1]: [[(3) Linear Algebra 1.2.1 Row Reduction and Echelon Forms]]