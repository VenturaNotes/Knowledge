---
Source:
  - https://www.youtube.com/watch?v=_B3rc3Vys4o
Reviewed: false
---
- ![[Screenshot 2024-12-03 at 11.50.39 PM.png]]
	- We're going to more fully characterize all vectors in the [[null space]] of a given matrix
	- Find a description of the null space of A by finding a set of vectors that [[span]] null(A).
		- The span of a set of vectors is all linear combinations
		- We're going to find a compact way to write this infinite collection of vectors that comprise the null space of A
	- What the null space means is that we're trying to find the set of vectors such that Ax equals 0
		- Can set up an [[augmented matrix]] and find all solutions of this system of equations
		- Found [[pivot|pivots]] in first two columns giving us our [[basic variable|basic variables]]
			- The ones with no pivots are going to be [[free parameter|free variables]]
			- The system of equations is very much [[overdetermined]]
				- A system of equations is considered overdetermined if there are more equations than unknowns[^1]
		- We only have three equations but four unknowns
	- So we'll able to write the null space of our matrix, the general solution for all the vectors in the null space as a linear combination of two vectors. This means that the null space is the span of those two vectors
	- `x` consists of all linear combinations because $x_3$ and $x_4$ are free so that is the same thing as the span of those vectors
	- So I've been able to find a full characterization of my null space. My null space of this matrix is really the span of these two vectors and the span is an infinite collection. It's all possible linear combinations of these two things. Since my null space can be written as the span of two vectors, the dimension of my null space is of size 2
		- This is a two-dimensional null space, because there's really two vectors that characterize it by the span
	- [[Dimension|dim]](null(A))


## References

[^1]: https://en.wikipedia.org/wiki/Overdetermined_system#:~:text=In%20mathematics%2C%20a%20system%20of,when%20constructed%20with%20random%20coefficients.