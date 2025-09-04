## Synthesis
- 
## Source [^1]
- A theorem in formal language theory that concerns the nature of context-free languages when order of letters is disregarded.
- Let the alphabet $\Sigma$ be the set $\left\{a_{1}, \ldots, a_{n}\right\}$. The [[letter distribution]], $\upvarphi(w)$, of a $\Sigma$-word $w$ is the $n$-tuple $$\left\langle N_{1}, \ldots, N_{n}\right\rangle$$with $N_{i}$ the number of occurrences of $a_{i}$ in $w$. The Parikh image, $\upvarphi(L)$, of a $\Sigma\text{-language}$ $L$ is $$\{\upvarphi(w) \mid w \in L\}$$i.e. the set of all letter-distributions of words in $L . L_{1}$ and $L_{2}$ are letter-equivalent if$$\upvarphi\left(L_{1}\right)=\upvarphi\left(L_{2}\right)$$Letter distributions may be added component-wise as vectors. This leads to the following: a set $S$ of letter distributions is linear if, for some distributions $d$ and $d_{1}, \ldots, d_{k}, S$ is the set of all sums formed from $d$ and multiples of $d_{i}.S$ is semilinear if it is a finite union of linear sets.
- Parikh's theorem now states that if $L$ is context-free $\upvarphi(L)$ is semilinear. It can also be shown that $\upvarphi(L)$ is semilinear if and only if $L$ is letter-equivalent to a regular language. Hence any context-free language is letter-equivalent to a regular language-although not all such languages are context-free.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]