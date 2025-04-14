---
aliases: terms
---
## Synthesis
- 
## Source [^1] 
### Definition
- A single number, variable, or a number multiplied by one or many variables
### Examples
- 7
- 4x
- $24x^2y^4z^8n^{12}$

## Source[^2]
- An expression formed from symbols for functions, constants, and variables. An example is

  

$$

f(a, g(h(b), c, d))

$$

  

Terms are defined recursively as follows: a term is either a variable symbol, a constant symbol, or else has the form $\phi\left(\tau_{1}, \ldots, \tau_{k}\right)$, where $\phi$ is a function symbol and each of $\tau_{1}, \ldots, \tau_{k}$ is itself a term. The example above thus has the overall form $f\left(\tau_{1}, \tau_{2}\right)$ : in this case $\phi=f$ and $k=2$. Another constraint is that different occurrences of the same symbol $\phi$ cannot occur with different values of $k$, i.e. each $\phi$ must have a fixed arity (number of arguments). Thus

  

$$

f(a, f(h(b), c, d))

$$

  

would not be a term since the first $f$ has arity 2 while the second has arity 3 ; neither would

  

since the first $h$ has arity 1 while the second has arity 0 .

Terms are often built using signatures. A $\Sigma$-term is a term in which each constant and function symbol used is in a signature $\Sigma$, and has the arity associated with it by $\Sigma$ and, if $\Sigma$ is a many-sorted signature, all the sorts match properly. A $\Sigma$-term is also called a term over signature $\Sigma$. Often a $\Sigma$-term is allowed to contain variables (of arity 0 ) in addition to symbols in $\Sigma$. Terms containing variables are called [[open term|open terms]]; terms containing only symbols of the signature are called closed or ground terms. Terms can also be viewed as trees (see TREE LANGUAGE). Terms (whether as expressions or as trees) are important in the construction of virtually all syntactic concepts. Terms as defined here are sometimes called first-order terms, to distinguish them from the higher-order terms (such as those involved in lambda calculus). See also EQUATION, INITIAL ALGEBRA, PREDICATE CALCULUS.

## References
[^1]: [[(1) Variables and Algebraic Expressions#^83d9b4]]
[^2]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]