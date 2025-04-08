## Synthesis
- 
## Source [^1]
- A widely applicable discretization method for the solution of ordinary and partial differential equations. In this approach all derivatives are replaced by approximations that involve solution values only, so in general the differential equation is reduced to a system of nonlinear equations or linear algebraic equations. For example, in the problem

  

$$

\begin{aligned}

& y^{\prime \prime}+b y^{\prime}+c y=d \quad 0 \leq x \leq 1 \\

& y(0)=\alpha, y(1)=\beta

\end{aligned}

$$

  

where $b, c, d, \alpha$, and $\beta$ are given constants, the interval $[0,1]$ is first divided into equal subintervals of length $h ; h$ is called the [[stepsize]] (or mesh or grid size). This gives the mesh points (or grid points) $x_{n}$,

  

$$

\begin{aligned}

& x_{n}=n h \\

& n=0,1, \ldots, N+1 \\

& h=1 /(N+1)

\end{aligned}

$$

  

At interior mesh points the derivatives are now replaced by finite-difference approximations, e.g.

  

$$

\begin{aligned}

& y^{\prime}\left(x_{}\right) \cong(1 / 2 h)\left[y\left(x_{+1}\right)-y\left(x_{-1}\right)\right] \\

& y^{\prime \prime}\left(x_{}\right) \cong\left(1 / h^{2}\right)\left[y\left(x_{+1}\right)-2 y\left(x_{}\right)+y\left(x_{-1}\right)\right]

\end{aligned}

$$

  

When combined with the boundary conditions these approximations result in a system of equations for approximations to $y\left(x_{n}\right), n=1,2, \ldots, N$. Nonlinear differential equations yield a system of nonlinear equations.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]