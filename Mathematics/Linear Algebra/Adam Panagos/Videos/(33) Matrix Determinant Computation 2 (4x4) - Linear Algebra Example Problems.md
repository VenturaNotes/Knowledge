---
Source:
  - https://www.youtube.com/watch?v=pBZ98bm191o
Reviewed: false
---
- ![[Screenshot 2024-11-19 at 7.24.22 PM.png]]
	- Errata
		- There is a mistake in the problem where in the second row, -4 was written down but then used +4 for the rest of the problem so answer might be different
	- Matrix Determinant Computation #2
	- Will be using a 4x4 matrix
	- Will briefly discuss what the value of the determinant tells us about whether the matrix is invertible or not invertible
		- Will compute determinant and determine if A is invertible or not
	- General approach is [[co-factor expansion]]. Free to choose any row or column we like.
		- We like the first row here because there are a few zeros. A couple of the multiplies will end up being zero and that will save us some computations. In general, try to pick a row or column that has a lot of zeros to make many co-factor expansion terms go away and save ourselves from some of the computations that we need to do.
	- Based on finding the [[determinant]], we can now make a conclusion on whether the matrix A is invertible or not. If the determinant of a matrix is 0, it's not invertible. If it is non-zero, then it is invertible
		- In this example `det`(A) $\ne$ 0 $\to$ Matrix A is invertible