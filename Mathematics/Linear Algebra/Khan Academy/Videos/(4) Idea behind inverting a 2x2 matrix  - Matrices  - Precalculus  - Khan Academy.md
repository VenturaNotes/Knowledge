---
Source:
  - https://www.youtube.com/watch?v=iUQR0enP7RQ
Reviewed: false
---
- ![[Screenshot 2023-09-26 at 9.51.58 PM.png]]
	- [[Identity Matrix]]
		- Denoted by "I"
		-  Important that both directions shown (works both ways only if dealing with [[square matrix|square matrices]]). It can work one direction or another if not square
			  $I * A   = A$
			- $A * I = A$
		- A 2x2 matrix has the identity $\begin{bmatrix}1 & 0\\ 0 & 1 \end{bmatrix}$
			- A 3x3 matrix and 4x4 matrix are similar where there are 1s along the top-left diagonal and 0s everywhere else.
	- For $A^{-1}A = I$
		- A is an inverse of $A^{-1}$ and $A^{-1}$ is an inverse of A
		- $A^{-1}A = I$
		- $AA^{-1} = I$
	- $A^{-1}$ = $\frac {1}{ad-bc}$$\begin{bmatrix}d & -b\\ -c & a \end{bmatrix}$
		- ad-bc is the [[determinant]] of matrix A
			- $|A| = ad-bc$
				- The determinant of A is equal to ad minus bc
	- $A^{-1} = \frac {1}{|A|}$$\begin{bmatrix}d & -b\\ -c & a \end{bmatrix}$