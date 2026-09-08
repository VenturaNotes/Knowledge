---
aliases:
  - dot product
  - scalar product
  - inner products
---
## Synthesis
- 
## Source [^1]
- (inner product space) An inner product is a generalization of the scalar product. An inner product on $\mathbb{R}^n$ is usually denoted $\langle \mathbf{u}, \mathbf{v} \rangle$ rather than $\mathbf{u} \cdot \mathbf{v}$ and satisfies:
	- (i) $\langle a\mathbf{u} + b\mathbf{v}, \mathbf{w} \rangle = a\langle \mathbf{u}, \mathbf{w} \rangle + b\langle \mathbf{v}, \mathbf{w} \rangle$.
	- (ii) $\langle \mathbf{u}, \mathbf{v} \rangle = \langle \mathbf{v}, \mathbf{u} \rangle$.
	- (iii) $\|\mathbf{v}\|^2 \ge 0$ and if $\langle \mathbf{v}, \mathbf{v} \rangle = 0$, then $\mathbf{v} = \mathbf{0}$.
- The norm (or length) $\|\mathbf{v}\|$ of a vector then equals $\sqrt{\langle \mathbf{v}, \mathbf{v} \rangle}$. The distance between points $\mathbf{v}$ and $\mathbf{w}$ is then defined as $\|\mathbf{v} - \mathbf{w}\|$ and the angle between $\mathbf{v}$ and $\mathbf{w}$ equals$$\cos^{-1} \left( \frac{\langle \mathbf{v}, \mathbf{w} \rangle}{\|\mathbf{v}\| \|\mathbf{w}\|} \right),$$(see CAUCHY-SCHWARZ INEQUALITY). A real inner product space is a real vector space with an inner product. A complex inner product space is a complex vector space with an inner product that satisfies instead
	- (ii)' $\langle \mathbf{u}, \mathbf{v} \rangle = \overline{\langle \mathbf{v}, \mathbf{u} \rangle}$
- to ensure that $\langle \mathbf{v}, \mathbf{v} \rangle$ is real. See also HILBERT SPACE.
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]