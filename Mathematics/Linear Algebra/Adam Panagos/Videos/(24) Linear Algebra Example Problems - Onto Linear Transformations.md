---
Source:
  - https://www.youtube.com/watch?v=-M0kHX-rIv4
Reviewed: false
---
- ![[Screenshot 2024-11-19 at 6.16.50 PM.png]]
	- [[Onto linear transformations]]
		- onto is another property that a linear transformation can have
	- Part A
		- Consider the LT with standard matrix representation. Is this LT onto?
			- A 3x3 matrix takes elements in $\mathbb{R}^3$ and returns elements in $\mathbb{R}^3$ 
		- A linear transformation is onto if columns of A [[span]] $\mathbb{R}^3$ 
			- If they span $\mathbb{R^3}$, that means we can linearly combine them to reach any point we want in $\mathbb{R}^3$ which is the definition of onto. Onto means that I can get to every single point in the space that I would like to reach.
				- To check if it's an onto transformation, it's equivalent to checking if the columns of the standard matrix representation span the space
				- To [[span]] $\mathbb{R}^3$, we ned 3 linearly independent vectors
		- We got just the trivial solution in previous video which tells us that the vectors are linearly independent and since there are 3 of them, we know that they span $\mathbb{R}^3$. Since they span $\mathbb{R}^3$, we can reach any point in $\mathbb{R}^3$  that we would like by choosing coefficients to weight and sum the vectors appropriately
		- So this linear transformation is onto!
	- Part B
		- Since the vectors have a free variable, they are not independent (they are dependent), which means they don't span $\mathbb{R}^3$ which means LT is not onto
		- A linear transformation is onto if every point can be reached (in this case, it was the set of points $\mathbb{R}^3$. To check if you can reach every point in $\mathbb{R}^3$ we need to check if we can span $\mathbb{R}^3$. If something spans a space, it's equivalent to determining if the collection of vectors is linearly independent or dependent. Can check that by constructing an equation corresponding to the homogeneous system of equations and seeing if you have a trivial solution or non-trivial solution