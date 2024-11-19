[Video](https://www.youtube.com/watch?v=61knWwBM3gQ)

- ![[Screenshot 2024-11-18 at 7.41.43 PM.png]]
	- Finding Matrix A of a LT
	- Consider the LT T: $\mathbb{R}^3 \to \mathbb{R}^3$ 
		- LT stands for linear transformation
	- We're told that the linear transformation can be written as:
		- $T(x) = x_1v_1 + x_2v_2 + x_3v_3$, the output of the linear transformation is simply the summation of the v vectors where each one has been weighted by the corresponding entry in x
		- Need to find A. How to represent this linear transformation as a matrix operation on a vector x
	- Would've been more appropriate to write $v_1x_1 + v_2x_2 + v_3x_3$ as the T(x) above, because that's how we define scalar multiplication but it's clear what we're doing. The $v_i$ is a vector and $x_i$ is a scalar
		- Pretty much just guessed what A could be for this problem
			- So this is the matrix representation for the linear transformation defined by the operation T(x) above
	- Second example
		- In $[v1 \space v2 \space 0]$, the 0 would be the all-zeros vector
		- Often, A is comprised of the vectors you're given. Just need to multiply it out and verify that it is the case. For more complicated examples, may need to write things out and solve a system of equations, but for this example, it was fairly obvious how to write down a guess for A and then verify it through a simple matrix-vector multiplication 