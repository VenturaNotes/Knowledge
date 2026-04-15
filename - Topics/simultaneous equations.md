## Synthesis
- 
## Source [^1]
- A set of equations that together define an unknown set of values or functions. The term is normally applied to linear algebraic equations.
## Source[^2]
- A set of equations used in the solution of $n$ linear algebraic equations in $n$ unknowns, having the general form:$$\begin{align}&a_{11}x_1+a_{12}x_2+a_{13}x_3+...+a_{1n}x_n=b_1 \\ &a_{21}x_1+a_{22}x_2+a_{23}x_3+...+a_{2n}x_n=b_2\\&a_{31}x_1+a_{32}x_2+a_{33}x_3+...+a_{3n}x_n=b_3\\ &\cdots \\ &a_{n1}x_1+a_{n2}x_2+a_{n3}x_3+...+a_{nn}x_n=b\end{align}$$
	- #question Shouldn't it be $b_n$ at the end? Was that a typo? 
- Cramer’s rule states that the $j$th unknown is given directly by$$x_j = \frac{\Delta_j}{\Delta}$$where $\Delta$ is the determinant of the matrix of the coefficients $a_{ij}$ ($i,j = 1, 2, 3,\ldots,n$) and $\Delta_j$ is the determinant of the matrix obtained from the matrix of the coefficients $a_{ij}$ by replacing the coefficients of the $j$th column with the coefficients $b_j$ ($j = 1, 2, 3,\ldots,n$). This assumes that the equations are linearly independent, i.e. that $\Delta \neq 0$.
- The Gaussian elimination technique repeatedly combines different rows such that the original system of equations is transformed into a system of the type shown below. This is achieved by taking the first equation of the original system and multiplying it by a factor such that when added to the second equation the coefficient of $x_1$ is zero. This is repeated but with the third equation and so on until all the coefficients of $x_1$ become zero. With this new set of equations the technique is repeated so that the coefficients of $x_2$ become zero. This is repeated until $x_n$ can be solved directly, i.e. $\alpha_{nn}x_n = \beta_n$. Then by a process of back-substitution all the other unknowns can be determined.$$
\begin{array}{l}
\alpha_{11}x_1 + \alpha_{12}x_2 + \alpha_{13}x_3 + \dots + \alpha_{1n}x_n = \beta_1 \\
\alpha_{22}x_2 + \alpha_{23}x_3 + \dots + \alpha_{2n}x_n = \beta_2 \\
\alpha_{33}x_3 + \dots + \alpha_{3n}x_n = \beta_3 \\
\dots \\
\alpha_{nn}x_n = \beta_n \\
\end{array}
$$
- Gaussian elimination and Cramer’s rule are used extensively in circuit analysis, where the simultaneous equations are formulated using either node or loop analysis: $x_1$ through $x_n$ are the unknown node voltages (or mesh currents), $a_{ij}$ ($i,j = 1, 2, 3\ldots,n$) are known admittances (or resistances), and $b_1$ through $b_n$ are known source voltages (or currents).
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]