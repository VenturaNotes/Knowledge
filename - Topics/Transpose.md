---
aliases: transposed
---
## Synthesis
- 
## Source [^1]
### Definition
- The transpose of a matrix is when the rows become columns and the columns become the rows
	- Given A = $\begin{bmatrix}2 & 1 \\ 3 & 5\end{bmatrix}$, $A^{T}$ = $\begin{bmatrix}2 & 3 \\ 1 & 5\end{bmatrix}$
### Rules
- Given A is a matrix
	- $|A| = |A^{T}|$
		- The determinant of a matrix is equal to the determinant of the transpose of that matrix

## Source[^2]
- (of an $m \times n$ matrix $A$ ) The $n \times m$ matrix, symbol $A^{\mathrm{T}}$, given by interchanging rows and columns. Thus the $i, j$th element of $A^{\mathrm{T}}$ is equal to the $j$, $i$th element of $A$.
## Source[^3]
- The transpose of an $m \times n$ matrix is the $n \times m$ matrix obtained by interchanging the rows and columns. The transpose of $\mathbf{A}$ is denoted by $\mathbf{A}^T, \mathbf{A}^t$, or $\mathbf{A}'$. Thus, if $\mathbf{A} = [a_{ij}]$, then $\mathbf{A}^T = [a_{ij}']$, where $a_{ij}' = a_{ji}$; that is,
	- [ ] Where does the (\`) start? It seems like it's $a_{ji}$$'$ in the text but maybe that's incorrect?
- $$\mathbf{A} = \begin{bmatrix} a_{11} & a_{12} & \dots & a_{1n} \\ a_{21} & a_{22} & \dots & a_{2n} \\ \vdots & \vdots & \ddots & \vdots \\ a_{m1} & a_{m2} & \dots & a_{mn} \end{bmatrix}, \mathbf{A}^T = \begin{bmatrix} a_{11} & a_{21} & \dots & a_{m1} \\ a_{12} & a_{22} & \dots & a_{m2} \\ \vdots & \vdots & \ddots & \vdots \\ a_{1n} & a_{2n} & \dots & a_{mn} \end{bmatrix}.$$
- The following properties hold, for matrices $\mathbf{A}$ and $\mathbf{B}$ of appropriate orders:
	- (i) $(\mathbf{A}^T)^T = \mathbf{A}$.
	- (ii) $(\mathbf{A} + \mathbf{B})^T = \mathbf{A}^T + \mathbf{B}^T$.
	- (iii) $(k\mathbf{A})^T = k\mathbf{A}^T$.
	- (iv) $(\mathbf{AB})^T = \mathbf{B}^T \mathbf{A}^T$.

## References
[^1]: [[(13) Linear Algebra - Ch 2 - Determinants (13 of 48) Example of Rule 7 - Transpose of a Matrix]]
[^2]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^3]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]