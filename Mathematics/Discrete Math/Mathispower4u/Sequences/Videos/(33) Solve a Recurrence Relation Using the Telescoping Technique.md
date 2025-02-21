---
Source:
  - https://www.youtube.com/watch?v=gQPZbLEc7EA
Reviewed: false
---
- ![[Screenshot 2025-02-20 at 10.30.08 AM.png]]
	- Solve Recurrence Relations: Telescoping
		- Solve the recurrence relation $a_n = a_{n-1} + 2^n$ with $a_0 = 3$
			- Sequence: 3, 5, 9, 17, 33
				- Sequence appears to be increasing by powers of 2
				- #question is recurrence relation and recursive relation different?
		- Using telescoping, consider
		- Key Terms
			- [[Telescoping]]: When many terms of the sequence cancel out when adding the equations of the sums or differences of terms. If we know the sum of the non-cancelling terms, we can find a closed formula
			- [[Geometric Series Partial Sum]]: $S = a_0 (\frac {1-r^{n+1}}{1-r})$
		- Now we need to use the partial sum formula for a geometric series or we can use the multiply, shift, and subtract method
	- Solve Recurrence Relations: Telescoping
		- Showing multiply, shift, and subtract method here