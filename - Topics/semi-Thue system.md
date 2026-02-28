## Synthesis
- 
## Source [^1]
- An important concept in formal language theory that underlies the notion of a grammar. It was defined and investigated by Axel Thue from about 1904. A semi-Thue system over the alphabet $\Sigma$ is a finite set of ordered pairs of $\Sigma$-words:$$\left\{\left\langle l_{1}, r_{1}\right\rangle, \ldots,\left\langle l_{n}, r_{n}\right\rangle\right\}$$Each pair $\left\langle l_{i}, r_{i}\right\rangle$ is a rule, referred to as a [[production]], with left-hand side $l_{i}$ and right-hand side $r_{i}$; it is usually written$$l_{i} \rightarrow r_{i}$$
- Let $u$ and $v$ be $\Sigma$-words, and $l \rightarrow r$ be a production, then the word $u l v$ is said to directly derive the word $u r v$; this is written$$u l v \Rightarrow u r v$$
- So $w$ directly derives $w^{\prime}$ if $w^{\prime}$ is the result of applying a production to some substring of $w$. if$$w_{1} \Rightarrow w_{2} \Rightarrow \ldots \Rightarrow w_{n-1} \Rightarrow w_{n}$$then $w_{1}$ is said to derive $w_{\mathrm{n}}$; this is written$$w_{1} \stackrel{*}{\Rightarrow} w_{n}$$So $w$ derives $w^{\prime}$ if $w^{\prime}$ is obtained from $w$ by a sequence of direct derivations.
- As one example, let $\Sigma$ be $\{a, b\}$ and let the productions be$$\{a b \rightarrow b a, b a \rightarrow a b\}$$then `aabba` derives `baaab` by the sequence
$$a a b b a \Rightarrow a b a b a \Rightarrow b a a b a \Rightarrow b a a a b$$
- It is clear that $w$ derives any permutation of $w$.
- As a second example, with productions$$\{a b \rightarrow b a, b a \rightarrow $\Lambda\}$$$w$ derives $\Lambda$ (the empty word) if and only if $w$ has the same number of `as` as `bs`.
- The question of whether $w$ derives $w^{\prime}$ is algorithmically undecidable.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]