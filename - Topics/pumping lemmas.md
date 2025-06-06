## Synthesis
- 
## Source [^1]
- Two theorems in formal language theory that express necessary conditions for languages to be regular or context-free:
	- If language $L$ is regular, there exists an integer $n$ such that,
		- for any word $z$ in $L,|z|>n$,
		- there exist $u, v, w$ with$$z=u v w, v \text { nonempty, } |vw| \le n,$$
		- such that:$$u v^{k} w \in L, \text { for all } k \geq 0$$
	- If language $L$ is context-free, there exist integers $p$ and $q$ such that,
		- for any $z$ in $L$, with $|z|>p$,
		- there exist $u, v, w, x, y$ with$$\begin{aligned}& z=u v w x y, v \text { and } x \text { nonempty, } \\& |vwx| \leq q,\end{aligned}$$such that:$$u v^{k} w x^{k} y \in L, \text { for all } k \geq 0$$
- The conditions are used in constructing algorithms for decision problems about regular and context-free grammars, and in proving certain languages are not regular or are not context-free.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]