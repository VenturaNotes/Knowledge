## Synthesis
- 
## Source [^1]
- The number $s(n,r)$ of ways of partitioning a set of $n$ elements into $r$ cycles. For example, the set $\{1,2,3,4\}$ can be partitioned into two cycles in the following ways:$$\begin{align}&[1,2,3][4], \quad [1,3,2][4], \quad [1,2,4][3], \quad [1,4,2][3],\\& [1,3,4][2], \quad [1,4,3][2], \quad [2,3,4][1], \quad [2,4,3][1],\\& [1,2][3,4], \quad [1,3][2,4], \quad [1,4][2,3].  \end{align}$$
- So $s(4, 2) = 11$. Clearly $s(n,1) = (n-1)!$ and $s(n, n) = 1$. It can be shown that$$ s(n + 1, r) = s(n, r - 1) + ns(n, r) $$
- Rather like the binomial coefficients, the Stirling numbers occur as coefficients in certain identities. They are named after the Scottish mathematician James Stirling (1692–1770).
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]