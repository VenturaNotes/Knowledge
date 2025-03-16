## Synthesis
- 
## Source [^1]
- (simultaneous equations) A problem in numerical linear algebra that requires the solution of $n$ equations in the unknowns $x_{1}, x_{2}, \ldots, x_{n}$ of the form$$A x=b$$where $A$ is a square $n \times n$ matrix. The solution obtained by computing the inverse matrix and forming $A^{-1} \boldsymbol{b}$ is less accurate and requires more arithmetical operations than elimination methods. In Gaussian elimination multiples of successive equations are added to all succeeding ones to eliminate the unknowns $x_{1}, x_{2}, \ldots, x_{n-1}$ in turn. Properly used, with row interchanges to avoid large multiples, this leads to a solution that satisfies exactly a system close to the one given, relative to the machine precision. The accuracy of the solution, which can be cheaply estimated, depends on the condition number of the problem.
- Many other methods are used to deal with matrices of special form. Very large systems where the matrix $A$ has predominantly zero entries occur in the solution of partial differential equations. Elimination methods tend to fill in the zeros causing storage problems and iterative methods are often preferred for such problems.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]