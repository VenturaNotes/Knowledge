## Synthesis
- 
## Source [^1]
- For the square matrix A, the determinant of A, denoted by det$A$ or |A|, can be defined as follows.
- The determinant of the $1 \times 1$ matrix $[a]$ is simply equal to $a$. If A is the $2 \times 2$ matrix below, then det$A$ = $ad-bc$, and the determinant can also be written as shown: $$A = \begin{bmatrix}a & b \\ c & d\end{bmatrix}, \text{det}A = \begin{vmatrix} a & b \\ c & d\end{vmatrix}.$$If A is a $3 \times 3$ matrix $[a_{ij}]$, then det A, which may be denoted by $$\begin{vmatrix} a_{11} & a_{12} & a_{13} \\ a_{21} & a_{22} & a_{23} \\ a_{31} & a_{32} & a_{33}\end{vmatrix},$$ is given by $$det A = a_{11} \begin{vmatrix} a_{22} & a_{23} \\a_{32} & a_{33}\end{vmatrix}-a_{12} \begin{vmatrix}a_{21} & a_{23} \\a_{31} & a_{33} \end{vmatrix} + a_{13} \begin{vmatrix} a_{21} & a_{22} \\a_{31} & a_{32} \end{vmatrix}$$Notice how each $2 \times 2$ determinant occurring here is obtained by deleting the row and column containing the entry by which the $2 \times 2$ determinant is multiplied. This expression for the determinant of a $3\times3$ matrix can be written $a_{11}A_{11} + a_{12}A_{12} + a_{13}A_{13}$, where $A_{ij}$ is the cofactor of $a_{ij}$. This is the evaluation of det$A$, 'by the first row'. In fact, det$A$ may be found by using evaluation by any row or column: for example, $a_{31}A_{31} + a_{32}A_{32} + a_{33}A_{33}$ is the evaluation by the third row, and $a_{12}A_{12} + a_{22}A_{22} + a_{32}A_{32}$ is the evaluation by the second column. The determinant of an $n \times n$ matrix A may be defined similarly, as $a_{11}A_{11} + a_{12}A_{12} + ... + a_{1n}A_{1n},$ and the same value is obtained using a similar evaluation by any row or column. These are known as the Laplace expansions of the determinant. However, calculating determinants this way is laborious; using elementary operations is much more efficient. The following properties hold:
	- (i) If two rows (or two columns) of a square matrix A are identical, then detA = 0
	- (ii) If two rows (or two columns) of a square matrix A are interchanged, then only the sign of detA is changed
	- (iii) The value of detA is unchanged if a multiple of one row is added to another row, or if a multiple of one column is added to another column
	- (iv) If A and B are square matrices of the same order, then det(AB) = det(A)(detB)
	- (v) If A is invertible, then det($A^{-1})$ =(detA)$^{-1}$.
	- (vi) If A is an $n \times n$ matrix, then det kA = $k^n$detA
	- (vii) det$A^T$ = detA, where $A^T$ is the transpose of A
	- (viii) For an $n\times n$ matrix A, the map $x \mapsto Ax$ scales area/volume by |detA| and is sense-preserving if detA > 0 and sense-reversing if detA < 0

## Source[^2]
- A number associated with a square matrix of numbers. The determinant of an $n \times n$ matrix $A$ is denoted by $\operatorname{det}(A)$ or $\|A\|$ and given by

  

$$

\sum \operatorname{par}(\sigma) a_{1} \sigma_{1} a_{2} \sigma_{2} \ldots a_{n} \sigma_{n}

$$

  

where the sum is taken over all $n$ ! permutations

  

$$

\sigma=\sigma_{1} \sigma_{2} \ldots \sigma_{n}

$$

  

of the integers $1,2, \ldots, n$. par( $\sigma$ ), the parity of $\Sigma$, is either +1 or -1 depending on whether $\Sigma$ is an even permutation or an odd permutation.
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]
[^2]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]