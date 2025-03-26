---
aliases:
  - TRS
---
## Synthesis
- 
## Source [^1]
- A formal system for manipulating terms over a signature by means of rules. A set $R$ of rules (each a rewrite rule) creates an abstract reduction system $\rightarrow_{R}$ on the algebra $T(\Sigma, X)$ of all terms over signature $\Sigma$ and variables $X$. Usually, the rules are a set $E$ of equations that determine a reduction system $\rightarrow_{E}$ using rewrites based on equational logic.

  

Let $E$ be a set of equations such that, for each $t=t^{\prime} \in E$, the left-hand side $t$ is not a variable. The pair $(\Sigma, E)$ is called an equational TRS. The equations of $E$ are used in derivations of terms where the reduction $t \rightarrow_{E} t^{\prime}$ requires substitutions to be made in some equation $e \in E$ and the left-hand side of $e$ is replaced by the right-hand side of $e$ in $t$ to obtain $t^{\prime}$.

  

The first set of properties of a term rewriting system $(\Sigma, E)$ is now obtained from the properties of abstract reduction systems. The following are examples.

(1) The term rewriting system $(\Sigma, E)$ is complete if the reduction system $\rightarrow_{R}$ on $T(\Sigma)$ is Church-Rosser and strongly terminating.

(2) Let $\equiv_{E}$ be the smallest congruence containing $\rightarrow_{E}$ and $T(\Sigma, E)$ be the factor algebra $T(\Sigma) \mid \equiv_{E}$. Then $T(\Sigma, E)$ is the initial algebra of $\operatorname{Alg}(\Sigma, E)$. If $(\Sigma, E)$ is a finite equational TRS specification that is complete, then $T(\Sigma, E)$ is a computable algebra.

  

See also ORTHOGONAL TERM REWRITING SYSTEM.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]