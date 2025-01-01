---
Source:
  - https://www.youtube.com/watch?v=OAh573i_qn8
Reviewed: false
---
- ![[Screenshot 2023-09-26 at 9.36.37 PM.png]]
	- [[Matrix multiplication]]
		- Can take the [[dot product]] of a [[row vector]] and [[column vector]] with the same length
		- $\underset{N\times \underline A}{C} \times \underset {\underline A\times M}{D}$
			- As long as the inner numbers (A) are the same, you can multiply the matrices
			- The $N \times M$ will be the dimensions of the resulting matrix
				- Rows of first matrix and columns of second matrix
- ![[Screenshot 2023-09-26 at 9.38.29 PM.png]]
	- This is an example where you can't multiply the matrices
		- A $1 \times 2$ matrix multiplied by a $3 \times 2$ matrix is not possible
			- Number of columns in first matrix not equal to number of rows in second matrix
	- You can multiply AB but you can't multiply BA sometimes