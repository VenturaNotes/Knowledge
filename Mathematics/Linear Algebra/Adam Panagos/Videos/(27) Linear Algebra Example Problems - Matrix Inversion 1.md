---
Source:
  - https://www.youtube.com/watch?v=1CO4d5r1Rxk
Reviewed: false
---
- ![[Screenshot 2024-11-19 at 6.40.55 PM.png|500]]
	- [[Matrix inversion]]
		- Will compute the inverse of a 2x2 matrix. Will use general algorithm that we can use to compute the inverse of any square matrix. In the next video, will use a close form equation that will make it really easy to compute the inverse of a 2x2 matrix
		- If it exists, find $A^{-1}$
			- Check existence. If the [[determinant]] of the matrix is non-zero, then we know that the inverse exists
				- $det(A)$ = (4)(3) - (-2)(2) for this case
		- To find the inverted matrix, you create an augmented matrix with A as the first half and the identity matrix as the second half
		- 2x2 [[identity matrix]]
			-  $\begin{bmatrix}1 & 0\\ 0 &1\end{bmatrix}$
				- It's a matrix that has zeros everywhere except 1s down the diagonal
				- $[A \space I]$ 
					- Will perform row operations to make it look like $[I \space A^{-1}]$ 
					- Manipulate front half into identity matrix so the right half will become the inverse of the matrix by definition