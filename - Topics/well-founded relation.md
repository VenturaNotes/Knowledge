## Synthesis
- 
## Source [^1]
- A particular kind of partial ordering, used in termination proofs (see PROGRAM CORRECTNESS PROOF). A well-founded relation on a set $S$ consists of a partial ordering

  

$$

R \subseteq S \times S

$$

  

such that there does not exist any infinite sequence $x_{1}, x_{2}, x_{3}, \ldots$ of members of $S$ for which each pair $\left\langle x_{i}, x_{i+1}\right\rangle$ belongs to $R$. As an example, if $S$ consists of the natural numbers, then the 'greater than' elation, containing all pairs $\langle m, n\rangle$ such that $m>n$, is wellfounded, since there are no infinite descending sequences of natural numbers. On the other hand 'greater than or equal to', and 'less than' are not well-founded. On the set of integers, none of these relations are well-founded. As another example, if $S$ is the set of all finite sets of natural numbers, then 'proper superset of' is well-founded.

  

In the application to terminate proofs it is shown that, whenever a certain point in the program is visited during execution, the current value of some quantity lies within $S$ and also that, if $x$ is the value of that quantity at one such visit, and $x^{\prime}$ its value at a later visit, the pair $\left\langle x, x^{\prime}\right\rangle$ belongs to $R$. It then follows that that point in the program cannot be visited infinitely often. By considering enough such points it can be concluded that any execution must have finite length.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]