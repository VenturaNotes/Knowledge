---
Source:
  - https://www.youtube.com/watch?v=k0f7w4xTp1I
Reviewed: false
tags:
  - in-progress
---
- ![[Screenshot 2026-01-13 at 1.16.15 AM.png]]
	- [[Proof by exhaustion]] problems
		- (1) No square number ends in an 8
			- Just go through all positive integers that we're squaring (0-9), and we'll see that none of them will end with an 8
		- (2) If n is an integer and $2 \le n \le 7$, then $A = n^2 +2$ is not divisible by 4
			- Proved original conjecture by going through each integer (2 to 7 inclusive), using the function A, and then showing the result is not divisible by 4
		- (3) Every integer that is a perfect cube is either a multiple of 9, is more than a multiple of 9, or is 1 less than a multiple of 9
			- Every integer can be represented below and we're seeing if they're a multiple of 9, 1 more or 1 less. 
				- $n = 3k$
					- multiple of 9
				- $n = 3k-1$
					- 1 less than a multiple of 9
				- $n = 3k-2$
					- 1 more than a multiple of 9
					- #comment This could've been $3k+1$ as well. The third case in the proof would look like this then
						- $n^3 = (3k+ 1)^3 = 27k^3 + 27k^2 + 9k + 1$
						- Factoring out 9 gives $9(3k^3 + 3k^2 + k) + 1$
							- The result is 1 more than a multiple of 9, which is the same conclusion we reached using $n = 3k-2$ 