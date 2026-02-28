## Synthesis
- 
## Source [^1]
- A widely used and successful approach to solving constrained optimization problems, that is$$\operatorname{minimize} F(x), x=\left(x_{1}, x_{2}, \ldots, x_{n}\right)^{\mathrm{T}},$$where $F(x)$ is a given objective function of $n$ real variables, subject to the $t$ nonlinear constraints on the variables,$$c_{i}(x)=0, i=1,2, \ldots, t$$Inequality constraints are also possible. A solution of this problem is also a stationary point (a point at which all the partial derivatives vanish) of the related function of $x$ and $\lambda$,$$\begin{aligned}

& L(x, \lambda)=F(x)-\Sigma \lambda_{i} c_{i}(x), \\

& \lambda=\left(\lambda_{1}, \lambda_{2}, \ldots, \lambda_{t}\right)

\end{aligned}$$
- A quadratic approximation to this function is now constructed that along with linearized constraints forms a quadratic programming problem - i.e., the minimization of a function quadratic in the variables, subject to linear constraints. The solution of the original optimization problem, say $x^{*}$, is now obtained from an initial estimate and solving a sequence of updated quadratic programs; the solutions of these provide improved approximations, which under certain conditions converge to $x^{*}$.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]