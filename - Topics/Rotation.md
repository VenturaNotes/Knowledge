## Synthesis
- 
## Source [^1]
- A rotation of the plane about the origin $O$ through an angle $\alpha$ is the transformation of the plane in which $O$ is mapped to itself, and a point $P$ with polar coordinates $(r,\theta)$ is mapped to the point $P'$ with polar coordinates $(r,\theta + \alpha)$. In terms of Cartesian coordinates, $P$ with coordinates $(x,y)$ is mapped to $P'$ with coordinates $(x',y')$, where$$\begin{align}&x' = x \cos \alpha - y \sin \alpha, \quad \\&y' = x \sin \alpha + y \cos \alpha.\end{align}$$
- ![[Pasted image 20260916055841.png|220]]
	- Rotation about $O$ by $\alpha$
- This change of coordinates can be represented by the matrix equation$$\begin{pmatrix} x' \\ y' \end{pmatrix} = \begin{pmatrix} \cos \alpha & -\sin \alpha \\ \sin \alpha & \cos \alpha \end{pmatrix} \begin{pmatrix} x \\ y \end{pmatrix}.$$
- Importantly, distances and angles are still calculated the same using $x'$ and $y'$ as when using $x$ and $y$. Note that the matrix is orthogonal and has determinant $1$. In 3-dimensional space, an orthogonal matrix with determinant $1$ represents a rotation about an axis through the origin.
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]