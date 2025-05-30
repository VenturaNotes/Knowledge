---
Source:
  - https://youtube.com/watch?v=D7_vwg4j3x0
Reviewed: false
---
- ![[Screenshot 2023-09-15 at 1.33.06 PM.png]]
	- Binomial Coefficients Everywhere
		- Foundational Enumeration Problem
			- Given a set of m identical objects and n distinct cells, the number of ways they can be distributed with the requirement that no cell is empty is
				- $m - 1 \choose n-1$
		- Explanation
			- AAAAAA|AA|AAAA|AAAAAAA|A|AAA
				- m objects, m - 1 gaps. Choose n - 1 of them. In this example, there are 23 objects and 6 cells. We have illustrated the distribution (6, 2, 4, 7, 1, 3)
				- If we imagine that m objects lined up in a line, then m objects determine m - 1 gaps. If we have n cells, then we can differentiate between those cells by having n - 1 markers between them
					- So of the m - 1 gaps, we choose n - 1 gaps
					- This determines the distribution
				- Since there will always be one object between any 2 gaps, that makes the distribution satisfy the rule that all cells are non-empty
				- Will learn how to extend this formula to solve related problems
	- Equivalent Problem
		- Restatement
			- How many solutions in positive integers to the equation:
				- $x_1 + x_2 + x_3 + ... x_n = m$
					- When we say $x_3$ is 6, it means that 6 of your objects have been assigned to cell/bin #3
			- Given a set of m identical objects and n distinct cells, the number of ways they can be distributed with the requirement that no cell is empty is
				- $m - 1 \choose n - 1$