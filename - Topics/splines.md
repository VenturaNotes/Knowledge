---
aliases:
  - spline
---
## Synthesis
- 
## Source [^1]
- In its simplest form a spline function (of degree n), $s(x)$, is a piecewise polynomial on $[x_1, x_N]$ that is $(n-1)$ times continuously differentiable, i.e. $$\begin{align} &s(x) = \text{polynomial of degree }n \\ &x_i\le x \le x_{i+1}, i = 1,2,...,N-1\end{align}$$These polynomial 'pieces' are all matched up at points (called knots): $$x_1 \le x_2 \le ... \le x_N$$in the interior of the range, so that the resulting function $s(x)$ is smooth. The idea can be extended to functions of more than one variable. Cubic splines$\textemdash$spline curves of degree 3$\textemdash$provide a useful means of approximating data to moderate accuracy. Splines are often the underlying approximations used in variational methods. See also $B\textendash SPLINE$
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]