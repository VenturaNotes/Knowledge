## Synthesis
- 
## Source [^1]
- A sequence of sets of functions $F_{0}, F_{1}, F_{2}, \ldots$ with the property that

  

$$

F_{0} \subseteq F_{1} \subseteq F_{2} \subseteq \ldots

$$

  

(see SUBSET). Typically the functions in $F_{0}$ will include certain initial functions; the sets of functions $F_{1}, F_{2}, \ldots$ are normally defined by combining initial functions in some way.

  

Hierarchies of primitive recursive functions can be defined by letting $F_{i}$ represent those functions that can be computed by programs containing at most $i$ loops nested one within the other. then

  

$$

F_{i} \subseteq F_{i+1}

$$

  

for all integers $i>0$. The union of all these sets includes all the primitive recursive functions and only those functions. Consequently the hierarchy is often called a [[subrecursive hierarchy]]. This same hierarchy can be expressed in a slightly different form, so resulting in the Grzegorczyk hierarchy.

  

In an attempt to circumvent problems caused by recursion, Bertrand Russell invented a [[theory of types]], which essentially imposed a hierarchy on the set of functions; functions at one level could be defined only in terms of functions at lower levels.

  

The study of hierarchies of functions dates from work of David Hilbert around 1926 on the foundations of mathematics. More recent interest stems from their applicability to computational complexity.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]