## Synthesis
- 
## Source [^1]
### In Mechanics
- A means of describing the turning effect of a force about a point. For a system of coplanar forces, the moment of one of the forces $\mathbf{F}$ about any point $A$ in the plane can be defined as the product of the magnitude of $\mathbf{F}$ and the distance from $A$ to the line of action of $\mathbf{F}$ and is considered to be acting either clockwise or anticlockwise. For example, suppose that forces with magnitudes $F_1$ and $F_2$ act at $B$ and $C$, as shown in the figure. The moment of the first force about $A$ is $F_1 d_1$ clockwise, and the moment of the second force about $A$ is $F_2 d_2$ anticlockwise. The principle of moments considers when a system of coplanar forces produces a state of equilibrium.
- ![[Pasted image 20260909204210.png|247]]
	- Moments about A
- However, a better approach is to define the moment of the force $\mathbf{F}$, acting at a point $B$, about the point $A$ as the vector $(\mathbf{r}_B - \mathbf{r}_A) \times \mathbf{F}$, where $\times$ denotes the vector product and $\mathbf{r}_A, \mathbf{r}_B$ are the position vectors of $A$ and $B$. The use of vectors not only eliminates the need to distinguish between clockwise and anticlockwise directions but facilitates the measuring of the turning effects of non-coplanar forces acting on a 3-dimensional body.
- Similarly, for a particle $P$ with position vector $\mathbf{r}$ and linear momentum $\mathbf{p}$, the moment of the linear momentum of $P$ about the point $A$ is the vector $(\mathbf{r} - \mathbf{r}_A) \times \mathbf{p}$. This is the angular momentum of the particle $P$ about the point $A$.
- Suppose that a couple consists of a force $\mathbf{F}$ acting at $B$ and a force $-\mathbf{F}$ acting at $C$. The moment of the couple about $A$ is equal to$$(\mathbf{r}_B - \mathbf{r}_A) \times \mathbf{F} + (\mathbf{r}_C - \mathbf{r}_A) \times (-\mathbf{F}) = (\mathbf{r}_B - \mathbf{r}_C) \times \mathbf{F},$$which is independent of the position of $A$.
### In Statistics
- For a set of observations $x_1, x_2, \dots, x_n$, the $j$th (sample) moment about $p$ is equal to$$\frac{\sum (x_i - p)^j}{n}.$$
- For a random variable $X$, the $j$th (population) moment about $p$ is equal to $E((X - p)^j)$ (see EXPECTED VALUE). The first moment about 0 is the mean. The second moment about the mean is the variance. The $j$th moment of $X$, without further specification, refers to the $j$th moment about 0.
- Suppose that a sample is taken from a population with $k$ unknown parameters. In the method of moments, the first $k$ population moments are equated to the first $k$ sample moments to find $k$ equations in $k$ unknowns. These can be solved to find the moment estimates of the parameters.
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]