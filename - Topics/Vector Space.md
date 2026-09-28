---
aliases:
  - linear space
  - vector spaces
---
## Synthesis
- Also known as a linear space
- A vector space is a collection of objects (called vectors) that can be added together and multiplied by numbers (scalars) such that the results remain within the same collection. 
	- It must follow specific rules, such as the existence of a [[zero vector]] and the property that adding vectors in any order gives the same result.
	- [ ] #question Are these the only rules of a vector space or are there more?
- Example
	- Most common example: $\mathbb{R}^2$
		- It is the set of all pairs of real numbers $(x, y)$. This represents the standard 2D Cartesian plane.
## Source [^1]
- (linear space) A main mathematical structure in linear algebra. A vector space $V$ over a field $F$ consists of a set $V$ with operations of addition $+: V \times V \to V$, and scalar multiplication $F \times V \to V$, such that $V$ is an abelian group under $+$ and further$$\alpha(\beta\mathbf{v}) = (\alpha\beta)\mathbf{v}, \quad (\alpha + \beta)\mathbf{v} = \alpha\mathbf{v} + \beta\mathbf{v}, \quad \alpha(\mathbf{v} + \mathbf{w}) = \alpha\mathbf{v} + \alpha\mathbf{w}, \quad 1\mathbf{v} = \mathbf{v},$$where $\alpha, \beta \in F$ and $\mathbf{v}, \mathbf{w} \in V$. Elements of $F$ are called scalars and elements of $V$ are called vectors. Examples of real vectors spaces (where $F = \mathbb{R}$) include:
	- the space of $m \times n$ real matrices;
	- the space of polynomials with real coefficients;
	- the solution space of homogeneous simultaneous linear equations;
	- the kernel and image of a linear map;
	- the space $\text{Hom}(V,W)$ of all linear maps between vector spaces $V$ and $W$;
	- sequence spaces (see $c$ and $l^\infty$);
	- the space of continuous real-valued functions on a topological space.
- A vector space $V$ is finite-dimensional if it has a finite basis, in which case all bases will contain the same number of elements, the space's dimension. Once a basis is chosen, coordinates may be uniquely assigned to vectors identifying $V$ with $\mathbb{R}^{\dim V}$. See AFFINE SPACE, DUAL SPACE, INNER PRODUCT, MODULE, NORMED VECTOR SPACE, N-DIMENSIONAL SPACE, VECTOR SUBSPACE.

## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]