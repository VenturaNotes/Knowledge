## Synthesis
- 
## Source [^1]
- An important class of methods for the numerical solution of ordinary differential equations. For the initial-value problem$$y^{\prime}=f(x, y), y\left(x_{0}\right)=y_{0}$$the general form of the $k$-step method is$$\sum_{i=0}^{k} \alpha_{i} y_{n+i}=h \sum_{i=0}^{k} \beta_{i} f_{n+i}$$where $f r=f(x r, y r)$ and $h$ is the stepsize, $h=x_{r}-x_{r-1}$. The formula is said to be explicit if $\beta_{k}=0$ and implicit otherwise.
- The most important and widely used formulae of this type are the Adams formulae and the backward differentiation formulae (BDF). These formulae are derived from interpolation polynomials to previously computed values of $f(x, y)$ or $y(x)$ respectively. They form the basis for some of the best modern software, in which the stepsize and the step number $k$ are chosen automatically. The BDF codes, intended for stiff equations (see ORDINARY DIFFERENTIAL EQUATIONS), have been particularly successful in relation to other methods used for the same class of problems.
- Linear multistep methods are more efficient than Runge-Kutta methods when evaluations of $f(x, y)$ are sufficiently expensive. The ease with which the step number $k$ can be varied automatically permits the design of codes that can be efficient over a wide range of requested accuracies.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]