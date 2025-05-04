## Synthesis
- 
## Source [^1]
- A technique in optimization, pioneered by George B. Dantzig, that is widely used in economic, military, and business-management decisions. It deals with the problem of finding nonnegative values of the variables $x_{1}, x_{2}, \ldots, x_{n}$ that satisfy the constraints$$\begin{aligned}& a_{i 1} x_{1}+a_{i 2} x_{2}+\ldots+a_{i n} x_{n}=b_{i} \\& i=1,2, \ldots, m\end{aligned}$$and minimize the linear form$$c_{1} x_{1}+c_{2} x_{2}+\ldots+c_{n} x_{n}$$
- Maximizing problems and problems with inequality constraints or unrestricted variables can be converted to this form. An optimum solution (if any exist) is known to be a basic feasible solution, which is one that satisfies the constraints and has at most $m$ positive $x_{i}$ values.
- Computationally such problems are solved by the [[simplex method]], an algorithm that terminates after a finite number of steps. It starts at a basic feasible solution and moves through the set of such solutions in such a manner that the value of the linear form is nonincreasing. Very large problems occur in practice involving sparse matrices. Iterative infinite algorithms are sometimes faster, notably [[Karmarkar's method]].
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]