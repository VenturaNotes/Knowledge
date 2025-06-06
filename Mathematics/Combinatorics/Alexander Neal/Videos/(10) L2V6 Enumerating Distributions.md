---
Source:
  - https://youtube.com/watch?v=tqUnn5RuyRs
Reviewed: false
---
- ![[Screenshot 2023-09-14 at 9.58.37 AM.png]]
	- [[Enumerating Distributions]]
		- Basic Enumeration Problem
			- Given a set of m objects and n cells (boxes, bins, etc,), how many ways can they be distributed?
		- Side Constraints
			- (1) Distinct / non-distinct objects
			- (2) Distinct / non-distinct cells
			- (3) Empty cells allowed / not allowed
			- (4) Upper and lower bounds on number of objects in a cell
		- Examples
			- Passing out paper clips to students will have distinct cells but non-distinct objects
		- Solving:
			- Given
				- Distinct bins
					- 4 bins
				- Non-distinct objects
					- 17 apples
				- No empty bins
			- Choose 3 gaps (1 less than distinct bins)
			- If you have m objects and n bins, you have m -1 gaps and you choose n - 1
				- Answer is $\frac {m-1}{n-1}$
				- We have 1 less gap than we have objects
					- There are 16 gaps but 17 objects