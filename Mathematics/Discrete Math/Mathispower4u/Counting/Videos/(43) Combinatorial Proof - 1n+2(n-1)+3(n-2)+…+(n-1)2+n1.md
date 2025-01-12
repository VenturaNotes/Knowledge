---
Source:
  - https://www.youtube.com/watch?v=TEGLzqZrgVs
Reviewed: false
---
- ![[Screenshot 2025-01-12 at 2.55.56 AM.png]]
	- Combinatorial Proofs
		- Proof
		- Consider the question "How many 3-element subsets are there of the set {1,2,3,...,n+2}?" We answer this in two ways:
			- Answer 1: We must select 3 elements from the collection of $n+2$ elements. This can be done in $n + 2 \choose 3$ ways
			- Answer 2: Break this problem up into cases by what the middle number in the subset is. Say each subset is {a, b, c} written in increasing order. We count the number of subsets for each distinct value of $b$. The smallest possible value of $b$ is 2, and the largest is $n+1$ 
	- Combinatorial proofs
		- Each subset is {a, b, c} written in increasing order
			- When b = 2, there are $1*n$ subsets: 1 choice for $a$ and $n$ choices (3 through n+ 2) for c
			- ....
			- Therefore, the total number of subsets is $1n+2(n-1)+3(n-2)+...+(n-1)2+n1$
			- Since Answer 1 and Answer 2 are answers to the same question, they must be equal.