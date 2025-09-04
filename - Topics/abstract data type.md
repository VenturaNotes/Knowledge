---
aliases:
  - ADT
---
## Synthesis
- 
## Source [^1]
- A conceptual model of the way that data is arranged and the operations that can be carried out on the data.

## Source[^2]
- A data type that is defined solely in terms of the operations that apply to objects of the type without commitment as to how the value of such an object is to be represented (see DATA ABSTRACTION).

  

An abstract data type strictly is a triple $(D, F, A)$ consisting of a set of domains $D$, a set of functions $F$ each with range and domain in $D$, and a set of axioms $A$, which specify the properties of the functions in $F$. By distinguishing one of the domains $d$ in $D$, a precise

  

characterization is obtained of the data structure that the abstract data type imposes on $d$.

For example, the natural numbers comprise an abstract data type, where the domain $d$ is

  

$$

\{0,1,2, \ldots\}

$$

  

and there is an auxiliary domain

  

# \{TRUE,FALSE\}

  

The functions or operations are ZERO, ISZERO, SUCC, and ADD and the axioms are:

  

```

\(\operatorname{ISZERO}(0)=\operatorname{TRUE}\)

ISZERO(SUCC \((x))=\operatorname{FALSE}\)

\(\operatorname{ADD}(0, y)=y\)

\(\operatorname{ADD}(\operatorname{SUCC}(x), y)=\operatorname{SUCC}(\operatorname{ADD}(x, y))\)

```

  

These axioms specify precisely the laws that must hold for any implementation of the natural numbers. (Note that a practical implementation could not fulfil the axioms because of word length and overflow.) Such precise characterization is invaluable both to the user and the implementer. Sometimes the concept of function is extended to procedures with multiple results.
## References

[^1]: [[(Home Page) Glossary by ada computer science]]
[^2]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]