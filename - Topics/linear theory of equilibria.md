## Synthesis
- 
## Source [^1]
- For small perturbations about an equilibrium, terms of higher order than linear may be considered negligible (see LINEARIZATION). Small angles $\theta$, that a simple pendulum makes about the vertical, satisfy $\ddot{\theta} = -(g/l)\theta$; this is SHM, which has small bounded trigonometric solutions, and so $\theta = 0$ is a stable equilibrium. For $\theta = \pi + \varepsilon$, that is, small perturbations about the upward vertical, we have$$\ddot{\varepsilon} = \ddot{\theta} = -\frac{g}{l} \sin \theta = -\frac{g}{l} \sin(\pi + \varepsilon) = \frac{g}{l} \sin \varepsilon \approx \frac{g}{l} \varepsilon$$which has unbounded exponential solutions, and so $\theta = \pi$ is an unstable equilibrium.
- Linearizing about $(0, 0, 0)$, the three equations governing the Lorenz attractor give$$\frac{dx}{dt} = \alpha(y - x), \quad \frac{dy}{dt} = \beta x - y, \quad \frac{dz}{dt} = -\gamma z$$where $\alpha, \beta, \gamma > 0$. So $\mathbf{r}(t) = (x(t), y(t), z(t))^T$ satisfies$$\frac{d\mathbf{r}}{dt} = \begin{pmatrix} -\alpha & \alpha & 0 \\ \beta & -1 & 0 \\ 0 & 0 & -\gamma \end{pmatrix} \mathbf{r}.$$
- If the matrix has distinct real eigenvalues $\lambda_1, \lambda_2, \lambda_3$ with eigenvectors $\mathbf{v}_1, \mathbf{v}_2, \mathbf{v}_3$, then the solution is$$\mathbf{r}(t) = A_1 e^{\lambda_1 t} \mathbf{v}_1 + A_2 e^{\lambda_2 t} \mathbf{v}_2 + A_3 e^{\lambda_3 t} \mathbf{v}_3$$
- This is a small bounded solution if $\lambda_1, \lambda_2, \lambda_3$ are all negative; so the origin is stable when $\beta < 1$.
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]