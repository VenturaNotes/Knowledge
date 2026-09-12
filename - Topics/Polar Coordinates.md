## Synthesis
- 
## Source [^1]
- A technique for giving two-dimensional coordinates $(r,\phi)$ of a point. Radial distance $r$ is the distance along the horizontal $x$-axis, and polar angle $\phi$ describes an anti-clockwise rotation. See also CYLINDRICAL POLAR COORDINATES; SPHERICAL POLAR COORDINATES.
- ![[Pasted image 20260406101236.png|300]]
	- Polar coordinates
## Source[^2]
- Suppose that a point $O$ in the plane is chosen as origin, and let $Ox$ be a directed line through $O$, with a given unit of length. For any point $P$ in the plane, let $r = |OP|$ and, if $P$ is not $O$, let $\theta$ be the angle (in radians) that $OP$ makes with $Ox$, the angle being given a positive sense anticlockwise from $Ox$. The angle $\theta$ satisfies $0 \le \theta < 2\pi$. Then $(r, \theta)$ are the polar coordinates of $P$.
- ![[Pasted image 20260912104830.png|306]]
	- The polar coordinates of $P$
- Suppose that Cartesian coordinates are taken with the same origin and the same unit of length, with positive $x$-axis along the directed line $Ox$. Then the Cartesian coordinates $(x, y)$ of a point $P$ can be found from $(r, \theta)$, by $x = r\cos\theta$, $y = r\sin\theta$. Conversely, the polar coordinates can be found from the Cartesian coordinates by $r = \sqrt{x^2 + y^2}$, and $\theta$ is such that$$\cos \theta = \frac{x}{\sqrt{x^2 + y^2}}, \quad \sin \theta = \frac{y}{\sqrt{x^2 + y^2}}.$$
- (Note that $\theta = \tan^{-1}(y/x)$ but this is not, of itself, sufficient to uniquely determine $\theta$.) In certain circumstances, authors may allow $r$ to be negative, in which case the polar coordinates $(r, \theta)$ give the same point as $(-r, \theta + \pi)$.
- In mechanics, it is useful, when a point $P$ has polar coordinates $(r, \theta)$, to define unit vectors $\mathbf{e}_r$ and $\mathbf{e}_\theta$ by$$\mathbf{e}_r = \mathbf{i}\cos\theta + \mathbf{j}\sin\theta \text{ and } \mathbf{e}_\theta = -\mathbf{i}\sin\theta + \mathbf{j}\cos\theta,$$where $\mathbf{i}$ and $\mathbf{j}$ are unit vectors in the directions of the positive $x$- and $y$-axes. Then $\mathbf{e}_r$ is a unit vector along $OP$ in the direction of increasing $r$, and $\mathbf{e}_\theta$ is a unit vector perpendicular to this in the direction of increasing $\theta$. These vectors satisfy $\mathbf{e}_r \cdot \mathbf{e}_\theta = 0$ and $\mathbf{e}_r \times \mathbf{e}_\theta = \mathbf{k}$, where $\mathbf{k} = \mathbf{i} \times \mathbf{j}$.
- See RADIAL AND TRANSVERSE COMPONENTS.
## References

[^1]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]
[^2]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]