---
aliases:
  - power sets
---
## Synthesis
- 
## Source[^1]
### Notation
- Pr(A)

### Definition
- $Pr(A) = \{S|S \subseteq A\}$

## Source[^2]
### Examples
- (1)
	- A = {1, 2,3}
	- P(A) = {$\varnothing$, {1}, {2}, {3}, {1, 2}, {1, 3}, {2, 3}, {1, 2, 3}}
	- The cardinality of a power set is $2^n$ where n equals the cardinality of the original set
		- So $2^3$ = 8 = |P(A)|
- (2)
	- A = {a}
	- P(A) = {$\varnothing$, {a}}

## Source[^3]
- (of a set $S$ ) The set of all subsets of $S$, typically denoted by $2^{S}$. It can be described as$$\{A \mid A \subseteq S\}$$The number of elements in the power set of $S$ is $2^{N}$, where $N$ is the number of elements in $S$.
## Source[^4]
- The set of all subsets of a set $S$ is the power set of $S$, denoted by $\wp(S)$. Suppose that $S$ has $n$ elements $a_1, a_2, \dots, a_n$, and let $A$ be a subset of $S$. For each element $a_i$ of $S$, there are two possibilities: either $a_i \in A$ or not. Considering all $n$ elements leads to $2^n$ possibilities in all. Hence, $S$ has $2^n$ subsets; that is, $\wp(S)$ has $2^n$ elements. If $S = \{a, b, c\}$, the $8 (=2^3)$ elements of $\wp(S)$ are$$\emptyset, \{a\}, \{b\}, \{c\}, \{a, b\}, \{a, c\}, \{b, c\}, \text{ and } \{a, b, c\}.$$
- Cantor's Diagonal Theorem states that the power set of a set always has greater cardinality than the cardinality of the set.
## References
[^1]: [[(Home Page) Problems on Discrete Mathematics by Chung-Chih Li et. al.#^w7ps6y]]
[^2]: [[(18) What is a Power Set. - Set Theory, Subsets, Cardinality]]
[^3]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^4]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]