## Synthesis
- 
## Source [^1]
- A method used in the solution of linear algebraic equations. See SIMULTANEOUS EQUATIONS.
## Source[^2]
- A particular systematic procedure for solving a set of linear equations in several unknowns. This is normally carried out by applying elementary row operations to the augmented matrix$$\begin{bmatrix} a_{11} & a_{12} & \cdots & a_{1n} & b_1 \\ a_{21} & a_{22} & \cdots & a_{2n} & b_2 \\ \vdots & \vdots & \ddots & \vdots & \vdots \\ a_{m1} & a_{m2} & \cdots & a_{mn} & b_m \end{bmatrix}$$to transform it to echelon form. The method is to divide the first row by $a_{11}$ and then subtract suitable multiples of the first row from the subsequent rows, to obtain a matrix of the form$$\begin{bmatrix} 1 & a'_{12} & \cdots & a'_{1n} & b'_1 \\ 0 & a'_{22} & \cdots & a'_{2n} & b'_2 \\ \vdots & \vdots & \ddots & \vdots & \vdots \\ 0 & a'_{m2} & \cdots & a'_{mn} & b'_m \end{bmatrix}.$$
	- (If $a_{11} = 0$, it is necessary to interchange two rows first.) 
- The first row now remains untouched, and the process is repeated with the remaining rows, dividing the second row by $a'_{22}$ to produce a 1 and subtracting suitable multiples of the new second row from the subsequent rows to produce zeros below that 1. The method continues in the same way. The essential point is that the corresponding set of equations at any stage has the same solution set as the original. (See also GAUSS-JORDAN ELIMINATION, SIMULTANEOUS LINEAR EQUATIONS.)
## References

[^1]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]
[^2]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]