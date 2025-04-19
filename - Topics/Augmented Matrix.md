## Synthesis
- 
## Source [^1]
- Given the equations:
	- $x_1 + x_2 = 5$ 
	- $3x_1 - 2x_2 = 10$
- The augmented matrix is:
	- $\left[\begin{array}{rr|r} 1 & 1 & 5 \\ 3 & -2 & 10 \\ \end{array}\right]$
		- Has both the coefficients and solution set
		- Has a divider or solid line (although textbook may not have a divider)

## Source[^2]
- ![[Screenshot 2024-12-18 at 11.11.48 AM.png|300]]
	- This is an augmented matrix where the first three columns are the coefficients and the 4th column is the solution set.
	- There is no solid line that shows the distinction, but the above is a valid representation

## Source[^3]
- For a given set of $m$ linear equations in $n$ unknowns $x_{1}, x_{2}, \ldots x_{n}$,$$
\begin{gathered}

a_{11} x_{1}+a_{12} x_{2}+\ldots+a_{1 n} x_{n}=b_{1}, \\

a_{21} x_{1}+a_{22} x_{2}+\ldots+a_{2 n} x_{n}=b_{2}, \\

\vdots \\

a_{m 1} x_{1}+a_{m 2} x_{2}+\ldots+a_{m n} x_{n}=b_{m},

\end{gathered}
$$the augmented matrix is the matrix$$

\left[\begin{array}{cccccc}

a_{11} & a_{12} & \cdots & a_{1 n} & b_{1} \\

a_{21} & a_{22} & \cdots & a_{2 n} & b_{2} \\

\vdots & \vdots & \ddots & \vdots & \vdots \\

a_{m 1} & a_{m 2} & \cdots & a_{m n} & b_{m}

\end{array}\right]

$$obtained by adjoining to the matrix of coefficients an extra column of entries taken from the right-hand sides of the equations. The solutions of a set of linear equations may be investigated by transforming the augmented matrix to echelon form or reduced echelon form by elementary row operations. See GAUSSIAN ELIMINATION, GAUSS-JORDAN ELIMINATION.
## References

[^1]: [[(1) Linear Algebra 1.1.1 Systems of Linear Equations]]
[^2]: [[(7) Linear Algebra Example Problems - General Solution of Augmented Matrix]]
[^3]: [[Home Page - The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]