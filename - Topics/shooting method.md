## Synthesis
- 
## Source [^1]
- An iterative method for the solution of boundary-value problems in ordinary differential equations. Consider the problem

  

$$

y^{\prime \prime}=f\left(x, y, y^{\prime}\right), y(a)=\alpha, y(b)=\beta

$$

  

Let $y(x ; t)$ denote the solution of this differential equation from initial conditions

  

$$

y(a)=\alpha, y^{\prime}(a)=t

$$

  

This solves the above problem if $F(t)=0$ where

  

$$

F(t)=y(b ; t)-\beta

$$

  

The equation $F(t)=0$ is solved iteratively, usually by some variant of Newton's method. Each iteration therefore requires the numerical integration of an initial-value problem.

  

The method is applicable to all types of boundary-value problems, whatever the form of the boundary conditions. Apart from the problem of obtaining good estimates to start the iteration, difficulties can arise due to severe error propagation in the integration of the initial-value problem. A useful improvement is to guess the missing conditions at both ends of the range, matching the two solutions so defined at an interior point. In difficult cases estimates and matching can be used at several interior points to reduce error propagation; this is known as the parallel-shooting method.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]