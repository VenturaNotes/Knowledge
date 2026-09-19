## Synthesis
- 
## Source [^1]
- The number $S(n,r)$ of ways of partitioning a set of $n$ elements into $r$ non-empty subsets. For example, the set $\{1,2,3,4\}$ can be partitioned into two non-empty subsets in the following ways:$$\begin{align} &\{1,2,3\} \cup \{4\}, \quad \{1,2,4\} \cup \{3\}, \quad \{1,3,4\} \cup \{2\},\\& \{2,3,4\} \cup \{1\}, \quad \{1,2\} \cup \{3,4\},  \\& \{1,3\} \cup \{2,4\}, \quad \{1,4\} \cup \{2,3\}. \end{align}$$
- So $S(4, 2) = 7$. Clearly, $S(n,1) = 1$ and $S(n,n) = 1$. It can be shown that$$ S(n + 1, r) = S(n, r - 1) + rS(n, r) $$
- Rather like the binomial coefficients, the Stirling numbers occur as coefficients in certain identities. They are named after the Scottish mathematician James Stirling (1692–1770).
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]