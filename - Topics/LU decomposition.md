## Synthesis
- 
## Source [^1]
- A method used in numerical linear algebra in order to solve a set of linear equations,$$A x=b$$where $A$ is a square matrix and $b$ is a column vector. In this method, a lower triangular matrix $L$ and an upper triangular matrix $U$ are sought such that$$L U=A$$For definiteness, the diagonal elements of $L$ may be taken to be 1 . The elements of successive rows of $U$ and $L$ may easily be calculated from the defining equations. 
- Once $L$ and $U$ have been determined, so that$$L U x=b,$$the equation$$L y=b$$is solved by forward substitution. Thereafter the equation$$U x=y$$is solved for $x$ by backward substitution. $x$ is then the solution to the original problem. 
- A variant of the method, the method of [[LDU decomposition]], seeks lower and upper triangular matrices with unit diagonal and a diagonal matrix $D$, such that$$A=L D U$$If the matrix $A$ is symmetric and positive definite, there is an advantage in finding a lower triangular matrix $L$ such that$$A=L L^{\mathrm{T}}$$(see TRANSPOSE). This method is known as Cholesky decomposition; the diagonal elements of $L$ are not, in general, unity.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]