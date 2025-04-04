---
Source:
  - https://www.youtube.com/watch?v=Y5QP7OSMkU4
Reviewed: false
---
- ![[Screenshot 2025-01-02 at 2.35.17 PM.png]]
	- [[Subset|subsets]]
		- Consider the set A = {1, 2, 3, 4, 5}.
		- How many subsets of A are there? $|\mathcal{P}(A)|$ is the cardinality of the [[power set]] of $\mathcal P(A)$ 
			- The power set of A is equal to the set containing all of the subsets of A and so the cardinality is equal to the number of subsets in A
		- Think about how we would build a subset. For each of the element of A, decide whether or not to include the element in our subset. We need to decide "yes" or "no" for the element 1, "yes" or "no" for the element 2, etc. For each of the 5 elements, we have 2 choices. Therefore, the number of subsets is simply $2*2*2*2*2 = 32$ (by the [[multiplicative principle]] or counting principle)
			- #question is multiplicative principle the same as the counting principle?
			- $|\mathcal{P}(A)|$ = $2^n$ where $n$ is the number of elements in A
	- Subsets
		- Consider the set A = {1, 2, 3, 4, 5}.
			- A = {1, 2, 3, 4, 5} $\to$ $|\mathcal{P}(A)| = 32$ 
		- Of those 32 subsets, how many have 3 elements?
			- The multiplicative principle indicates that there are a total of $5*4*3 = 60$ ways to select the 3-element subset. However, 60 > 32? This isn't correct because $5*4*3 = 60$ indicates the order of the elements matter, but we know the order of the elements does not change the set. For example, the sets {2, 4, 5} and {5, 2, 4} are the same set. We can correct this by dividing. For each set of three elements, there are $3*2*1 = 6$ ways to arrange the elements which are counted as different sets in the 60 ways. To determine the number of unique subsets, we divide by 6. $\frac {60}{6} = 10$ subsets contain exactly 3 elements
	- Subsets
		- Now let's consider the number of subsets with 0, 1, 2, 3, 4, and 5 elements?
			- The number of subsets with 4 elements will be the same as the number of subsets with 1 element. Every time we form a subset with 1 of the 5 elements, we leave behind 4 elements that would form a subset with 4 elements
				- ![[Screenshot 2025-01-02 at 2.26.21 PM.png|200]]
		- There is a much easier way to determine the number of subsets of a set using combinations. A [[combination]] of objects is used when order does not matter
		- $n \choose k$ $= C(n, k)=$ $_nC_k$ = the number of subsets of a set of size n each with cardinality k
			- $n \choose k$$= \frac {n!}{(n-k)!k!}$
				- This is a [[closed formula]]
			- Read as n choose k
				- n is the number of elements in the original set
				- k is the cardinality or size of the subset
				- n items chosen k at a time 
			- Given $5 \choose 2$ $= 10$ 
				- Set A has 10 subsets with cardinality 2
					- 10 subsets with 2 elements
			- Note: A permutation is used when order does matter
	- Most calculators do have a combination function
		- Go to functions $\to$ $_nC_r$ to get $_nC_r(5,2) = 10$ 