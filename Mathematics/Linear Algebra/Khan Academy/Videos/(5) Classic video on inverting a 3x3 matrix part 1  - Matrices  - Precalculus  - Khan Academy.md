[Video](https://www.youtube.com/watch?v=S4n-tQZnU6o)

- ![[Screenshot 2023-09-26 at 10.45.40 PM.png]]
	- [[Inverse of 3x3 Matrix]]
		- Higher levels of dimensions would be preferably done by a computer
		- Create a [[matrix of minors]] 
			- A [[minor]] is another 3x3 matrix. The top-left element will essentially be the determinant of crossing out the row and column the element is in
		- Now need to convert to [[matrix of cofactors]] (applied to matrix of cofactors)
			- Think of checkerboard of plus and minus
		- [[Adjoint]] of matrix A or the correct term is the [[adjugate]] of matrix A
			- This is just the [[transpose]] of the matrix of cofactors
				- Transpose just means you switch the rows and columns (flip across diagonal)
		- $A^{-1} = \frac {1}{|A|} * adj(A)$
			- [[Inverse]]