---
Source:
  - https://youtube.com/watch?v=XMWBC5_rFpI
Reviewed: false
---
- Image
	- [[Determinant]] and the [[invertible matrix theorem|IMT]] which will lead us to the characteristic equation
	-  Example
		- Find the eigenvalues of A
		- Will use the IMT to solve this
		- Looking for $\lambda$ where the equation $(A-\lambda I)\vec x = 0$ is equal to 0 which means we're looking for the non-trivial solution
			- By the IMT, it's essentially equivalent to us finding all the lambdas so that the resulting matrix of $(A - \lambda I)$ is not invertible
			- Trying to find where matrix is not invertible
				- We know this when the determinant is equal to 0
		- so $0 = det(A - \lambda I)$ 
		- We find $\lambda$ to be 3 and that is my solution (eigenvalue). Since it happened twice, we say it has a [[multiplicity]] of 3 because
			- $0 = (x-3)^2$ 
				- #question does it matter if it has a multiplicity of 3?
	- More on determinants
		- Let A be an $n \times n$ matrix, and A~u where u is in echelon form obtained by row replacements and r interchanges (no scaling). Then `det` A is equal to $(-1)^r$ times the product of the diagonal entries. If A is invertible, these are all pivots. If it is not invertible, there is at least 1 zero entry.