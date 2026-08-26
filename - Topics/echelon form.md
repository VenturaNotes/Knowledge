---
aliases:
  - triangle form
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-12-09 at 10.42.09 AM.png|300]]
- Echelon is also known as triangle form
- To be in echelon form:
	- (1) All non-zero rows are above all zero rows
	- (2) Each leading entry of a row is in a column to the right of the leading entry of the row above it
	- (3) All entries in a column below a leading entry are zeros
- Different from [[Reduced Row Echelon Form]] which has more steps

## Source[^2]
- ![[Screenshot 2024-12-18 at 10.04.18 AM.png|300]]
	- This is in echelon form
## Source[^3]
- A row of a matrix is called zero if all its entries are zero. Then a matrix is in echelon form if (i) all the zero rows come below the non-zero rows, and (ii) the first non-zero entry in each non-zero row is 1 and occurs in a column to the right of the leading 1 in the row above. For example, these two matrices are in echelon form:$$ \begin{bmatrix} 1 & 6 & -1 & 4 & 2 \\ 0 & 0 & 1 & 2 & -3 \\ 0 & 0 & 0 & 1 & 5 \end{bmatrix}, \quad \begin{bmatrix} 1 & 6 & -1 & 4 & 2 \\ 0 & 1 & 2 & -3 & 5 \\ 0 & 0 & 0 & 0 & 0 \end{bmatrix} $$
- Any matrix can be transformed to a matrix in echelon form using elementary row operations, by a method known as Gaussian elimination. The solutions of a set of linear equations may be investigated by transforming the augmented matrix to echelon form. Further elementary row operations may be used to transform a matrix to reduced echelon form.
## References

[^1]: [[(3) Linear Algebra 1.2.1 Row Reduction and Echelon Forms]]
[^2]: [[(4) Linear Algebra 1.2.2 Solution Sets and Free Variables]]
[^3]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]