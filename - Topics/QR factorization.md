## Synthesis
- 
## Source [^1]
- A form of matrix factorization widely used in numerical linear algebra. For $A$, an $m \times n, m \geq n$, real square matrix, the factorization takes the form

  

$$

A=Q R

$$

  

where $Q$ is an $m \times m$ orthogonal matrix and $R$ is an $m \times n$ matrix whose first $n$ rows form an upper (or right) triangular matrix. An important application is in solving overdetermined linear systems of equations of the form $A x=b, m>n ; b$ is an $m$ component column vector and $x$ is a column vector of $n$ unknowns. The $Q R$ factorization, under appropriate conditions, reduces the problem to solving a simpler square upper triangular system of the form $R x=c$.

  

For a square matrix, $m=n$, a further major application is in computing the eigenvalues and eigenvectors of $A$. Here a sequence of $Q R$ factorizations are carried out in an iteration scheme that ultimately reduces $A$ to a matrix of a particularly simple form whose eigenvalues are the same as those of $A$. The eigenvalues (and if required, eigenvectors) can now be easily computed.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]