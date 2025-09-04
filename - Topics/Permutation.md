---
aliases: permutations
---
## Synthesis
- Order matters meaning AC and CA are distinct 
## Source[^1]
- Combinatorics viewpoint
	- Number of permutations of length "n" from an "m" [[characters|letter]] alphabet is
		- $P(m,n) = m(m-1)(m-2)...(m-n+1)$
			- n is length
			- m is number of characters in alphabet
	- Example
		- How many permutations of 250 objects taken 3 at a time?
		- P(250, 3) = $250(250-1)(250-3+1)$ = $250*249*248$
## Source[^2]
### Definition
- Order matters
- Formula
	- $_nP_r$ = $\frac {n!}{(n-r)!}$

### Examples
- Given CAT, how many permutations of 2 letters are there?
	- $_3P_2 = 6$
		- CA, CT, AC, AT, TA, TC
- Given CAT, find the total number of permutations
	- Permutations = $n!$ = 3! = 6
		- CAT, CTA, TAC, TCA, ACT, ATC
		- #question What happens when we have repeated characters? 

## Source[^3]
- (of a set $S$ ) A bijection of $S$ onto itself. When $S$ is finite, a permutation can be portrayed as a rearrangement of the elements of $S$. The number of permutations of a set of $n$ elements is $n!$
- A permutation of the elements of $\{1,2,3\}$ can be written$$\begin{align}&1~2~3 \\&2~1~3\end{align}$$indicating that 1 is mapped into 2, 2 into 1, and 3 into 3 . Alternatively the above can be written, using a cycle notation, as (1 2); this implies that the element 3 is unaltered but that 1 is mapped into 2 and 2 into 1 .
- For collections of elements in which repeated occurrences of items may exist, a permutation can be described as a rearrangement of elements in which each element appears with the same frequency as before.

## References
[^1]: [[(7) L2V3 Permutations & Combinations#^0a9870]]
[^2]: [[(1) Permutations Combinations Factorials & Probability#^139416]]
[^3]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]