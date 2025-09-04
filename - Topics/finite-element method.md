## Synthesis
- 
## Source [^1]
- A widely applicable approach to solving ordinary and particularly partial differential equations and similar problems. The approach embraces several variants, principally Galerkin's method and the Rayleigh—Ritz method. The basic idea, however, is the same and involves approximating the solution of the problem by a linear combination:

  

$$

u(x)=\sum_{j=1}^{p} c_{j} \phi_{j}(x)

$$

  

The functions $\phi_{1}, \phi_{2}, \ldots, \phi_{n}$ are always chosen to be simple and are called [[trial function|trial functions]]. The success of the method is due in part to choosing these functions to be low-degree splines. This in turn generally leads to a system of equations for the coefficients $c_{1}, c_{2}, \ldots, c_{n}$ that involves the treatment of sparse matrices, i.e. matrices in which a large proportion of the elements are zero; very efficient software can then be used.

  

In Galerkin's method the criterion for choosing the coefficients is that the amount by which $u(x)$ fails to satisfy the equation is in a certain sense small. The [[Rayleigh-Ritz method]] is a variational method. The finite-element method can in general be regarded as a process in which a solution in an infinite-dimensional space is replaced by an approximation that lies in a finite-dimensional subspace. The whole process is referred to as finite-element analysis.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]