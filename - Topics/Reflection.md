## Synthesis
- 
## Source [^1]
- Let $l$ be a line in the plane. Then the mirror-image of a point $P$ is the point $P'$ such that $PP'$ is perpendicular to $l$ and $l$ cuts $PP'$ at its midpoint.
- ![[Pasted image 20260916050712.png|173]]
	- Reflection in $l$
- Reflection in the line $l$ is the transformation of the plane that maps each point $P$ to its mirror-image $P'$. Suppose that the line $l$ passes through the origin $O$ and makes an angle $\alpha$ with the $x$-axis. If $P$ has polar coordinates $(r, \theta)$, its mirror-image $P'$ has polar coordinates $(r, 2\alpha - \theta)$. In terms of Cartesian coordinates, reflection in the line $l$ maps $P$ with coordinates $(x, y)$ to $P'$ with coordinates $(x', y')$, where$$ \begin{align}&x' = x \cos 2\alpha + y \sin 2\alpha, \\& y' = x \sin 2\alpha - y \cos 2\alpha. \end{align}$$
- In 3-dimensional space, an orthogonal matrix with determinant $-1$ and trace 1 represents a reflection in a plane containing the origin.
- In higher dimensions, in $\mathbb{R}^n$, reflection in the hyperplane with equation $\mathbf{r} \cdot \mathbf{n} = c$ is given by$$ \mathbf{r} \mapsto \mathbf{r} + 2 \left( \frac{c - \mathbf{r} \cdot \mathbf{n}}{\mathbf{n} \cdot \mathbf{n}} \right) \mathbf{n}. $$
- If $c = 0$, this is represented by an orthogonal matrix. In general, reflections are isometries.
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]