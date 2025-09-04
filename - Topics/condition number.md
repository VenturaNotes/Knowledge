## Synthesis
- 
## Source [^1]
- A number that gives a measure of how sensitive the solution of a problem is to changes in the data. In practice such numbers are often difficult to compute; even so they can play an important part in comparing algorithms. They have a particularly important role in numerical linear algebra. As an example, for the linear algebraic equations

  

$$

A x=b

$$

  

if $\boldsymbol{b}$ is changed to $\boldsymbol{b}+\Delta \boldsymbol{b}$ (simulating, for example, errors in the data) then the corresponding change $\Delta x$ in the solution satisfies

  

$$

\frac{\|\Delta x\|}{\|x\|} \leqslant \operatorname{cond}(A) \frac{\|\Delta b\|}{\|\boldsymbol{b}\|}

$$

  

where $\operatorname{cond}(A)=\llbracket A \rrbracket\left\llbracket A^{-1} \rrbracket\right.$ is the condition number of $A$ with respect to solving linear equations. The expression bounds the relative change in the solution in terms of the relative change in the data $\boldsymbol{b}$. The actual quantities are measured in terms of a vector norm (see APPROXIMATION THEORY). Similarly the condition number is expressed in terms of a corresponding matrix norm. It can be shown that $\operatorname{cond}(A) \geq 1$. If $\operatorname{cond}(A)$ is large the problem is said to be ill-conditioned and it follows that a small relative change in $\boldsymbol{b}$ can lead to a large relative change in the solution $\boldsymbol{x}$. This means that the accuracy of a computed approximation must be interpreted accordingly, taking into account the size of the possible data errors, machine precision, and errors induced by the particular algorithm.

  

Similar ideas apply to other problem areas and condition numbers feature in a measure of eigenvalue sensitivity in the matrix eigenvalue problem.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]