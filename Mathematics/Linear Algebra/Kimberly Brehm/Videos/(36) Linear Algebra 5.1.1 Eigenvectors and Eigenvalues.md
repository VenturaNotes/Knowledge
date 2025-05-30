---
Source:
  - https://youtube.com/watch?v=yh5ABTeNUpE
Reviewed: false
---
- ![[Screenshot 2025-01-13 at 11.07.09 PM.png]]
	- [[Eigenvectors]] and [[eigenvalues]]
		- An eigenvector of an $n\times n$ matrix is a non-zero vector $x$ such that $Ax = \lambda x$, where $\lambda$ is a scalar. A scalar $\lambda$ is called an eigenvalue of A if there is a nontrivial solution x of $Ax = \lambda x$ 
		- $\lambda$ could make a vector compress or stretch. Will create resulting vector somewhere along the line
	- Practice
		- Let A = matrix
		- (1) Determine if $\vec x$ is an eigenvector of A for $\vec x$ 
			- Yes, 3 is the $\lambda$ value
	- Practice
		- Let A
		- (2) Determine the eigenvalue of A for $\vec x$ 
			- The eigenvalue here is 5
			- $\vec x$ is an eigenvector
	- Practice
		- Let A
		- (3) Show that 3 is an eigenvalue of matrix A and find the corresponding eigenvectors
			- Need to take I, the [[identity matrix]]
				- #question why?
			- If we ended with identity matrix, it means we only had the trivial solution. 
			- If we have only the trivial solution, then it's not an eigenvalue
			- If we have a free variable, then  we have a non-trivial solution. Then therefore, it is an eigenvalue
				- Showed now that 3 is an eigenvalue 
			- The blue line shown is known as the [[eigenspace]]
				- This is the null space and the subspace of $\mathbb{R}^n$ 
				- It's a [[subspace]] and all the values on the line going through the point $(0, 0)$. For this case it's 2-D. Otherwise, could be $(0,0,...)$
			- For the basis, only have one value for a $2 \times 2$  because we have a free variable
				- #question how are they related?
				- It wouldn't make sense to have two vectors in a $2 \times 2$ matrix unless I was only having the trivial solution meaning it wouldn't work anyway. So we should always have one fewer
					- #question what does this mean?
- ![[Screenshot 2025-01-13 at 11.12.26 PM.png]]
	- Practice
		- Find a [[basis]] for the corresponding [[eigenspace]] for A and $\lambda = 2$
		- The formula $(A-\lambda I)\vec{x} = 0$ is important
		- This is a $3 \times 3$ matrix but only has 2 vectors in the basis
	- Practice
		- Show that $\lambda = 2$ is an eigenvalue for A
			- Free variable before told us that we had more than just the trivial solution 
			- Since we found the identity matrix for this problem, we only have the trivial solution which means that $\lambda = 2$ is not an eigenvalue for matrix A