## Synthesis
- 
## Source [^1]
- A technique for the solution of certain classes of ordinary and partial differential equations that involves the use of a variational principle. That is, the solution of the differential equation is expressed as the solution of a minimization problem that involves an integral expression. The equation is then solved by carrying out an approximate minimization. Variational principles arise naturally in many branches of physics and engineering. As an example, the solution of

  

$$

\begin{aligned}

& y^{\prime \prime}+q(x) y=f(x), 0 \leq x \leq 1 \\

& y(0)=y(1)=0

\end{aligned}

$$

  

is also the solution of the problem

  

$$

\begin{aligned}

& \min _{c \in V} \operatorname{ize} \int_{0}^{1}\left\{v^{\prime}(x)^{2}-q(x) v(x)^{2}\right. \\

& -2 f(x) v(x) \mathrm{d} x

\end{aligned}

$$

  

where $V$ is a class of sufficiently differentiable functions that are zero at $x=0$ and $x=1$. An approximate minimization can be carried out by minimizing over the subspace of functions

  

$$

\sum_{i=1}^{n} c_{i} \phi_{j}(x)

$$

  

When the trial functions $\phi_{j}(x)$ are splines, the resulting method is an example of the finite-element method.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]