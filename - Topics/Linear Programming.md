## Synthesis
- 
## Source [^1]
- A technique in optimization, pioneered by George B. Dantzig, that is widely used in economic, military, and business-management decisions. It deals with the problem of finding nonnegative values of the variables $x_{1}, x_{2}, \ldots, x_{n}$ that satisfy the constraints$$\begin{aligned}& a_{i 1} x_{1}+a_{i 2} x_{2}+\ldots+a_{i n} x_{n}=b_{i} \\& i=1,2, \ldots, m\end{aligned}$$and minimize the linear form$$c_{1} x_{1}+c_{2} x_{2}+\ldots+c_{n} x_{n}$$
- Maximizing problems and problems with inequality constraints or unrestricted variables can be converted to this form. An optimum solution (if any exist) is known to be a basic feasible solution, which is one that satisfies the constraints and has at most $m$ positive $x_{i}$ values.
- Computationally such problems are solved by the [[simplex method]], an algorithm that terminates after a finite number of steps. It starts at a basic feasible solution and moves through the set of such solutions in such a manner that the value of the linear form is nonincreasing. Very large problems occur in practice involving sparse matrices. Iterative infinite algorithms are sometimes faster, notably [[Karmarkar's method]].
## Source[^2]
- A modelling technique that determines an optimal solution for attaining an objective by taking into consideration a number of constraints. The objective function, often to optimize profits or minimize costs, is expressed as an equation and the constraints are also expressed in mathematical terms. Where only two products and few constraints are involved a solution may be obtained graphically. More than two products requires a computer program.
## Source[^3]
- A mathematical procedure for finding the maximum or minimum value of a linear objective function subject to linear constraints.
## Source[^4]
- The branch of mathematics concerned with maximizing or minimizing a linear function subject to a number of linear constraints. It has applications in economics, industry, and commerce, for example. In its simplest form, with two variables, the constraints determine a feasible region, which is the interior of a polygon in the plane. The objective function to be maximized or minimized attains its maximum or minimum value at a vertex of the feasible region. For example, consider the problem of maximizing $4x_1 - 3x_2$ subject to$$x_1 - 2x_2 \geq -4, 2x_1 + 3x_2 \leq 13, x_1 - x_2 \leq 4, x_1 = 0, x_2 \geq 0.$$
- The feasible region is the interior of the polygon $OABCD$ shown in the figure, and the objective function $4x_1 - 3x_2$ attains its maximum value of 17 at the point $B$ with coordinates $(5, 1)$.
- ![[Pasted image 20260909024910.png|217]]
	- The feasible region
- Often integer values are required, and in such cases the vertex is not always admissible and it will be necessary to test all points with integer values which lie close to the vertex. It is also possible that the objective function may be parallel to a constraining condition. In this case, all points on the boundary representing that constraint will be optimal.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: [[(Home Page) A Dictionary of Business and Management 6th Edition by Oxford Reference]]
[^3]: [[(Home Page) A Dictionary of Economics 5th Edition by Oxford Reference]]
[^4]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]