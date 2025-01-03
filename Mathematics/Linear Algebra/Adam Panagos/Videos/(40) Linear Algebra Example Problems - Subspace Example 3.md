---
Source:
  - https://www.youtube.com/watch?v=v6HYbBDcu1Y
Reviewed: false
---
- ![[Screenshot 2024-12-03 at 12.29.16 AM.png]]
	- Subspace Example #3
		- Consider the set $U = \{\begin{bmatrix}x \\ y \end{bmatrix} : x > 1\}$
			- Will work with a set of vectors in $\mathbb{R}^2$ 
			- We are going to denote the set of vectors as $U$ and $U$ consists of all 2-dimensional vectors of the form x, y, such that x (the first dimension) is greater than 1
		- Sketch the set first
	- Is U a [[subspace]] of $\mathbb{R}^2$?
		- We know that $\mathbb{R}^2$ with normal vector addition and normal scalar multiplication is a [[vector space]]
			- #question is there a difference between normal and regular vector addition?
		- $\mathbb{U}$ is obviously a subset of $\mathbb{R}^2$ because for every "x" in U, x is in $\mathbb{R}^2$ 
			- $\forall x \in U \implies x \in \mathbb{R}^2 \to U \text { is a subset of }\mathbb{R}^2$ 
		- To be a subspace
			- (1) [[Zero element]]
				- This is the element you can add to any vector in your collection of vectors and get back the vector you started with.
				- Adding the zero vector does not change the vector that you added it to
			- (2) Closed under addition
			- (3) Closed under scalar multiplication
		- So if you're working with a collection of vectors and those vectors are a subset of a vector space, the three things you need to check to see if the subset is actually a subspace are the 3 above things.
		- Now determining if U is a subspace
			- We find that U is not a [[subspace]] of $\mathbb{R}^2$ because the zero element is $\begin{bmatrix} 0 \\ 0 \end{bmatrix}$ which is not an element of U
			- The 3rd property doesn't hold. We picked a point in U and then an arbitrary constant and then found a vector not in U
			- Found to not be closed under scalar multiplication
		- U is not a subspace