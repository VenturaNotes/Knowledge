---
Source:
  - https://www.youtube.com/watch?v=rj4wveoFLD0
Reviewed: false
---
- ![[Screenshot 2025-01-12 at 4.11.50 AM.png]]
	- A [[Derangement]] of Elements
		- A derangement of n elements $\{1, 2, 3, ..., n\}$ is a permutation in which no element is fixed. For example, there are 6 permutations of the there elements $\{1, 2, 3\}$:
			- 123 132 213 231 312 321
		- but most of these have one or more elements fixed: 123 has all there elements fixed since all three elements are in their original positions, 132 has the first element fixed (1 is in its original first position), and so on. In fact, the only derangements of three elements are
			- 231 312.
		- If we go up to 4 elements, there are 24 permutations (because we have 4 choices for the first element, 3 choices for the second, 2 choices for the third leaving only 1 choice for the last). How many of these are derangements? If you list out all 24 permutations and eliminate those which are not derangements, you will be left with just 9 derangements. Let's see how we can get that number using PIE (Principle of Inclusion/Exclusion)
	- A Derangement of Elements
		- How many derangements are there of 4 elements?
			- We count all permutations and subtract those which are not derangements. There are 4! = 24 permutations of 4 elements. Now for a permutation to not be a derangement, at least one of the 4 elements must be fixed. There are $4 \choose 1$ choices for which single element we fix. Once fixed, we need to find a permutation of the other three elements. There are 3! permutations of 3 elements.
			- But now we have counted too many non-derangements, so we must add those permutations which fix two elements. There are $4 \choose 2$ choices for which two elements we fix, and then for each pair, 2! permutations of the remaining elements. But this adds too many, so subtract the permutations which fix 3 elements, all $4 \choose 3$ 1! of them. Finally add the $4 \choose 4$ 0! permutations (recall 0! = 1) which fix all four elements. All together we get that the number of derangements of 4 elements is:
			- $4! -$ $(4 \choose 1)$ 3! + $4 \choose 2$ 2! - $4 \choose 3$ 1! + $4 \choose 4$ 0! = 9