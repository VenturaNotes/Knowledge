## Synthesis
- 
## Source [^1]
- Given a square matrix $\mathbf{A}$, its exponential is $\exp \mathbf{A} = \mathbf{I} + \mathbf{A} + \mathbf{A}^2/2! + \mathbf{A}^3/3! + \dots$. This series converges in the space of $n \times n$ matrices. Further, $\exp(\mathbf{A} + \mathbf{B}) = \exp \mathbf{A} \exp \mathbf{B}$ for commuting matrices $\mathbf{A}, \mathbf{B}$, but this identity does not generally hold. Note two simultaneous scalar differential equations $dx/dt = 2x + 3y, dy/dt = x - y$, can be rewritten as $d\mathbf{r}/dt = \mathbf{A}\mathbf{r}$ where$$\mathbf{A} = \begin{pmatrix} 2 & 3 \\ 1 & -1 \end{pmatrix} \quad \text{and} \quad \mathbf{r} = \begin{pmatrix} x \\ y \end{pmatrix}.$$
- The solution then equals $\mathbf{r}(t) = \exp(\mathbf{A}t)\mathbf{r}(0)$. This matrix exponential also has an important role in the study of Lie groups.
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]