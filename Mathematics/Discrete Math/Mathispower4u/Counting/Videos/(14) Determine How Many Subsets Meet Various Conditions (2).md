---
Source:
  - https://www.youtube.com/watch?v=TtcyCtI2vKw
Reviewed: false
---
- ![[Screenshot 2025-01-02 at 2.48.13 PM.png]]
	- Subsets
		- How many subsets are there of cardinality 5?
		- How many subsets of cardinality 5 have {2, 3, 5} as a subset?
			- We will always choose the elements {2, 3, 5} which is just 1 combination or $3 \choose 3$ and then we multiply that by $5 \choose 2$ because we have 5 remaining elements from set S with 2 open slots.
		- How many subsets of cardinality 5 contain at least one odd number?
			- Since each subset must contain 5 elements, we know that every single subset with 5 elements will contain an odd number meaning we can just do $8 \choose 5$ 
			- Since there are only 4 evens in set S, if every subset must have 5 elements, this means that every subset must have at least one odd.
		- How many subsets of cardinality 5 contain exactly one even number?
	- $|\mathcal{P}(A)|=2^n$ where n is the number of elements in A
		- $n \choose k$ = the number of subsets of a set of size n each with cardinality k
			- = $C(n, k)$ = $_nC_r = \frac {n!}{(n-r)!r!}$
		- $P(n, k)$ = $_nP_k$ = $\frac {n!}{(n-k)!}$