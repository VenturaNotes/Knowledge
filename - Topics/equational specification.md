## Synthesis
- 
## Source [^1]
- A set of equations that specifies a computing system or abstract data type. More precisely, the system or data type is modelled by an algebra, and this algebra is defined by the equations using initial algebra semantics.

  

Let $A$ be an algebra of signature $\Sigma$. Then $A$ is said to have an equational specification ( $\Sigma$, $E)$, under initial-algebra semantics, if $E$ is a set of equations over $\Sigma$ such that the initial algebra $T(\Sigma, E)$ is isomorphic with $A$. For example, the algebra

  

$$

A=\left(\{0,1,2, \ldots\} ; 0, n+1, n+m, n . m, n^{2}\right)

$$

  

of natural numbers is specified by means of $(\Sigma, E)$ shown in Fig. $a$.

An equational specification with hidden functions and sorts is an equational specification in which extra or hidden functions and sorts of data are allowed in order to construct equations. Inventing and adding functions, and even data types, to specify a computation or to a model a system is an obvious and natural technique. Consider the algebra

  

$$

B=\left(\{0,1,2, \ldots\} ; 0, n+1, n^{2}\right)

$$

  

of numbers with signature $\Sigma^{\mathrm{SQ}}$ shown in Fig. $b$. The algebra $B$ is a $$ reduct of the algebra $A$ of numbers given above, i.e.

  

$

A \mathrm{I}_{\Sigma}{ }^{\mathrm{SQ}}=B,

$$

  

and $B$ can be specified by specifying $A$ using the equational specification $(\Sigma, E)$ given above. If $A$ is isomorphic with the initial algebra $T(\Sigma, E)$, then the reduct

  

$$

T(\Sigma, E)_{\Sigma}{ }^{\mathrm{SQ}}

$$

  

is isomorphic with the algebra $B$. Thus $(\Sigma, E)$ is an equational specification of $B$ with two hidden functions, namely addition and multiplication.

  

The square algebra $B$ cannot be given a finite equational specification without using hidden functions; thus the technique is essential. It is known that any computable algebra can be given an equational specification using as little as six hidden functions and four equations, and initial-algebra semantics.

  

| signature | arithmetic with square; |

| :-- | :-- |

| sort | nat; |

| constant | $0: \rightarrow$ nat |

| operations | succ: nat $\rightarrow$ nat |

| | add: nat $\times$ nat $\rightarrow$ nat |

| | mult: nat $\times$ nat $\rightarrow$ nat |

| end | sq: nat $\rightarrow$ nat |

  

# equations $\quad \operatorname{add}(x, 0)=x$

  

$$

\begin{aligned}

& \operatorname{add}(x, \operatorname{succ}(y))=\operatorname{succ}(\operatorname{add}(x, y)) \\

& \operatorname{mult}(x, 0)=0 \\

& \operatorname{mult}(x, \operatorname{succ}(y))=\operatorname{add}(\operatorname{mult}(x, y), x) \\

& \operatorname{sq}(x)=\operatorname{mult}(x, x)

\end{aligned}

$$

  

end

Fig. a Equational specification of an algebra of natural numbers

  

| signature | square algebra; |

| :-- | :-- |

| sort | nat; |

| constant | $0: \rightarrow$ nat |

| operations | succ: nat $\rightarrow$ nat |

| | sq: nat $\rightarrow$ nat |

  

end

Fig. $b$ Subsignature used in reduct

  

## Equational specification.

  

The general definition is as follows. An algebra $A$ of signature $\Sigma$ is said to have an equational specification $\left(\Sigma_{0}, E_{0}\right)$ with hidden functions and sorts, under initial-algebra semantics, if $\Sigma \subseteq \Sigma_{0}$, and $E_{0}$ is a set of equations over $\Sigma_{0}$ such that the reduct

  

$$

T\left(\Sigma_{0}, E_{0}\right)_{\Sigma}

$$

  

of the initial algebra $T\left(\Sigma_{0}, E_{0}\right)$ with respect to $\Sigma$ is isomorphic with $A$.

See also COMPUTABLE ALGEBRA.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]