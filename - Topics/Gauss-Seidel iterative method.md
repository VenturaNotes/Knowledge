## Synthesis
- 
## Source [^1]
- A technique for solving a set of $n$ linear equations in $n$ unknowns. If the system is summarized by $\mathbf{Ax} = \mathbf{b}$, then taking initial values as $x_i^{(1)} = \frac{b_i}{a_{ii}}$, it uses the iterative relation$$x_i^{(k)} = \frac{b_i - \underset{j<i}\sum a_{ij}x_j^{(k)} - \underset{j>i}\sum a_{ij}x_j^{(k-1)}}{a_{ii}},$$so it uses the new values immediately they are available, unlike the Jacobi method.
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]