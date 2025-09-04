## Synthesis
- 
## Source [^1]
- An algebra that can be faithfully implemented or represented on a computer, in principle. The notion is made mathematically precise using the theory of the effectively computable functions on the set of natural numbers (and the ChurchTuring thesis).

  

An algebra is computable if

(a) there is a mapping $\alpha: \Omega \rightarrow A$, called a numbering, that uses a recursive set $\Omega$ of natural numbers to represent, or code, the set $A$ of elements of the algebra;

  

(b) there are recursive functions on numbers that track the operations of the algebra in the set $\Omega$ of natural number codes;

(c) there is a recursive function that can decide whether or not two numbers in $\Omega$ code the same element of $A$.

  

The idea in (b) of tracking operations in the code set is formulated by a commutative diagram depicting an equation: for each operation

  

$$

\sigma: A^{k} \rightarrow A

$$

  

of the algebra there is a recursive function

  

$$

f: \Omega^{k} \rightarrow \Omega

$$

  

such that

  

$$

\sigma\left(\alpha\left(x_{1}\right), \ldots, \alpha\left(x_{k}\right)\right)=\alpha\left(f\left(x_{1}, \ldots, x_{k}\right)\right)

$$

  

for all $x_{1}, \ldots, x_{k} \in \Omega$. The idea of deciding equality in $A$ is formulated by the relation

  

$$

\begin{aligned}

& n \equiv_{a} m \text { dependarrow }, \alpha(n)=\alpha(m) \\

& \text { for } n, m \in \Omega

\end{aligned}

$$

  

A closely associated concept is that of a [[semicomputable algebra]]; this satisfies properties (a) and (b) above, and a third condition, weaker than (c), that whether or not two numbers in the set $\Omega$ code the same element of $A$ is recursively enumerable, rather than recursively decidable. $\varnothing$

  

The concepts of computable and semicomputable algebras are used to establish the scope and limits of digital computation. Some fundamental completeness theorems link these algebras with equational specifications and their properties:

(1) an algebra is semicomputable if and only if it can be defined uniquely by a finite set of equations, possibly involving extra or hidden functions and sorts, and using initialalgebra semantics;

(2) an algebra is computable if and only if it can be defined uniquely by a finite set of equations (possibly using hidden functions) whose associated term rewriting system has the Church-Rosser and strong termination properties.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]