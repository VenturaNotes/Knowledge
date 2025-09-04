## Synthesis
- 
## Source [^1]
- Two axioms in complexity theory, formulated by M. Blum. Let

  

$$

M_{1}, M_{2}, \ldots, M_{m} \ldots

$$

  

be an effective enumeration of the Turing machines and let $f_{i}$ be the partial recursive function of a single variable that is computed by $M_{i}$. (For technical reasons it is simpler to think in terms of partial recursive functions than set (or language) recognizers.) if

  

$$

F_{1}, F_{2}, \ldots, F_{n r} \ldots

$$

  

is a sequence of partial recursive functions satisfying

axiom 1:

$f_{i}(n)$ is defined if and only if $F_{i}(n)$ is defined, and axiom 2 :

$F_{i}(x) \leq y$ is a recursive predicate of $i, x$, and $y$,

then $F_{i}(n)$ is a computational complexity measure and can be thought of as the amount of some 'resource' consumed by $M_{i}$ in computing $f_{i}(n)$. This notion represents a useful abstraction of the basic resources-time and space. Several remarkable theorems about computational complexity have been proved for any measure of resources satisfying the two axioms (see GAP THEOREM, SPEEDUP THEOREM).
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]