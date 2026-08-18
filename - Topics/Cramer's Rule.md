## Synthesis
- 
## Source [^1]
- A rule used in the solution of linear algebraic equations. See SIMULTANEOUS EQUATIONS.
## Source[^2]
- Consider a set of $n$ linear equations in $n$ unknowns $x_1, x_2, \dots, x_n$, written in matrix form as $\mathbf{Ax} = \mathbf{b}$. When $\mathbf{A}$ is invertible, the set of equations has a unique solution $\mathbf{x} = \mathbf{A}^{-1}\mathbf{b}$. Since $\mathbf{A}^{-1} = (1/\text{det} \mathbf{A}) \text{adj} \mathbf{A}$, where $\text{adj} \mathbf{A}$ is the adjoint of $\mathbf{A}$, this gives the solution$$\mathbf{x} = \frac{(\text{adj} \mathbf{A})\mathbf{b}}{\text{det} \mathbf{A}},$$which may be written$$\begin{gather}x_j = \frac{b_1 A_{1j} + b_2 A_{2j} + \dots + b_n A_{nj}}{\text{det} \mathbf{A}}\\ \quad (j = 1, \dots, n),\end{gather}$$using the entries of $\mathbf{b}$ and the cofactors of $\mathbf{A}$. This is Cramer’s rule. Computationally Cramer’s rule is highly inefficient compared with Gaussian elimination.
## References

[^1]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]
[^2]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]