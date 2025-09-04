---
aliases:
  - ADJ
---
## Synthesis
- 
## Source [^1]
### (adjugate) (of a matrix)
- The adjoint of a square matrix $A$, denoted by adjA, is the transpose of the matrix of cofactors of $A$. For $A = [a_{ij}]$, let $A_{ij}$ denote the cofactor of the entry $a_{ij}$. Then the matrix of cofactors is the matrix $[A_{ij}]$ and adj$A[A_{ij}]^T$. For example, a $3 \times 3$ matrix $A$ and its adjoint can be written
	- ![[Screenshot 2025-04-05 at 12.50.14 AM.png]]
- In the $2 \times 2$ case, a matrix $A$ and its adjoint has the form
	- ![[Screenshot 2025-04-05 at 12.50.38 AM.png]]
- The adjoint is important because it can be used to find the inverse of a matrix. From the properties of cofactors, it can be shown that $AadjA = (detA)I$. It follows that, when $detA \ne 0$, the inverse of A is $(1/detA)adjA$. 

### (of a linear map)
- For $T: V \to V$, a linear map of an inner product space, the adjoint $T^*:V \to V$ satisfies $\langle Tv, w\rangle = \langle v, T^*w\rangle$ for all $v, w \in V$. If $M$ is the matrix of T with respect to an orthonormal basis then the transpose $M^T$ (real) or conjugate transpose $M^*$ (complex) is the matrix for $T^*$ 

## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]