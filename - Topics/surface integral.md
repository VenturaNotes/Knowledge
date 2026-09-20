## Synthesis
- 
## Source [^1]
- The integration of a function $f(x,y,z)$ over a surface $S$.$$\iint_{S} f (x, y, z) d S$$
- There are different formulations for the surface integral in terms of double integrals, depending on how $S$ is defined. If $S$ is defined as $g(x,y)$ over a region $D$, then we obtain$$\iint_{D} f(x, y, g(x, y)) \sqrt{ \left( \frac{\partial g}{\partial x} \right)^2 + \left( \frac{\partial g}{\partial y} \right)^2 + 1\,dA}$$
## Source[^2]
- For a smooth surface $\Sigma$, and continuous (see CONTINUOUS FUNCTION) scalar field $f$ on $\Sigma$ and a continuous vector field $\mathbf{F}$ on $\Sigma$, a surface integral may take either of the forms $\int_\Sigma f \, dS$ or $\int_\Sigma \mathbf{F} \cdot dS$. If $f$ is identically 1, then the integral $\int_\Sigma f \, dS$ defines the surface area of $\Sigma$. The integral $\int_\Sigma \mathbf{F} \cdot dS$ defines the flux of $F$ through $\Sigma$. If $\mathbf{r}(u, v)$, where $(u, v) \in U \subseteq \mathbb{R}^2$, is a parametrization of $\Sigma$, then the surface integrals are defined by$$\begin{align}& \int_\Sigma f \, dS = \iint_U f(\mathbf{r}(u, v)) \left| \frac{\partial \mathbf{r}}{\partial u} \times \frac{\partial \mathbf{r}}{\partial v} \right| du dv, \\& \int_\Sigma \mathbf{F} \cdot dS = \iint_U \mathbf{F}(\mathbf{r}(u, v)) \cdot \left( \frac{\partial \mathbf{r}}{\partial u} \times \frac{\partial \mathbf{r}}{\partial v} \right) du dv, \end{align}$$where $\times$ denotes the vector product. See DIVERGENCE THEOREM, STOKES' THEOREM.
## References

[^1]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]
[^2]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]