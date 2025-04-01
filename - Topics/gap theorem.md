## Synthesis
- 
## Source [^1]
- A theorem in complexity theory that, like the speedup theorem, can be expressed in terms of abstract complexity measures (see BLUM's AXIOMS) but will be more understandable in the context of time:given any total recursive function

  

$$

g(n) \geq n

$$

  

there exists a total recursive function $S(n)$ such that

  

$$

\operatorname{DTIME}(S(n))=\operatorname{DTIME}(g(S(n)))

$$

  

(see COMPLEXITY CLASSES). In other words there is a 'gap' between time bounds $S(n)$ and $g(S(n)$ within which the minimal space complexity of no language lies.

  

This has the following counter-intuitive consequence: given two universal models of computation, say a Turing machine that makes one move per century and the other a random-access machine capable of performing a million arithmetic operations per second, then there is a total recursive function $S(n)$ such that any language recognizable in time $S(n)$ on one machine is also recognizable within time $S(n)$ on the other.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]