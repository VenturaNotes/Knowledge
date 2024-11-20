[Video](https://www.youtube.com/watch?v=-n8QFEgnLk4)

- ![[Screenshot 2024-11-19 at 6.27.08 PM.png]]
	- [[Matrix multiplication]]
		- We use the [[row column product rule]] or column row product rule which says we can compute the ${ij}^{th}$ entry of the product AB (meaning row i column j). So we can compute one entry in this final matrix by doing the following computation
		- $(AB)_{ij} = \Sigma^n_{k=1}a_{ik}b_{kj}$ 
			- $a_{ik}$ is the row i, column k entry of the matrix A
			- $b_{kj}$ is the kth row, jth column of the matrix B
			- So just taking entries from matrix A and multiplying them by entries in matrix B
		- This definition is good for arbitrary matrices in general. We think of A as an $m\times n$ matrix, but we know for this to be a well-defined quantity, we need the number of columns in A to match the number of rows in B. Otherwise, we would run out of things to multiply in this definition
		- Inner dimensions must match
		- Output is the output dimensions
	- Example 1
		- First row of A and first column of B represents (1, 1) which will be the first entry (upper-left entry) in the output matrix
		- Good to know how to do this in general since may be using symbols or vectors