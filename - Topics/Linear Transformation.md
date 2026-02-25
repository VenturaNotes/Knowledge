---
aliases:
  - linear transformations
  - LT
---
## Synthesis
- A linear transformation is a function that maps vectors from one [[vector space]] to another (or to itself) in a way that preserves the operations of [[vector addition]] and [[scalar multiplication]]. 
	- #question What does it mean to map a vector space to itself? What does it look like? 
	- #question Show an example of vector addition and scalar multiplication
	- This means that if you apply the transformation to a sum of vectors, it's the same as applying it to each vector individually and then summing the results. 
		- #question Give an example of applying a transformation to a sum of vectors. Then show an example of applying the transformation to each vector individually and then summing the results. Then show how it's the same
	- Similarly, scaling a vector before transformation is the same as scaling it after. 
		- #question Show an example of this as well. 
	- Geometrically, linear transformations preserve lines through the origin and the origin itself. They can involve rotations, reflections, scaling, or shearing, and are typically represented by matrices.
		- #question Show me examples of rotations, reflections, scaling, and shearing for these matrices
		- #question If a line has been shifted, can a linear transformation still occur even if it's not about the origin? 
- #question What does a linear transformation look like? 
- A linear transformation can change the direction of a vector significantly
	- A rotation is a linear transformation, but it changes the direction of a vector, making the transformed vector generally not collinear with the original vector (unless vector is zero vector or rotation is by 0 or 180 degrees)
- A vector $v$ and its transformed vector $T(v)$ are collinear only if $v$ is an [[eigenvector]] of the linear transformation $T$.
	- When $T(v) = \lambda v$ for some scalar $\lambda$ (eigenvalue), $T(v)$ is a scalar multiple of $v$ and thus collinear. 
## Source [^1]
- LT stands for linear transformation
## References

[^1]: [[(19) Linear Algebra Example Problems - Finding 'A' of a Linear Transformation 1]]