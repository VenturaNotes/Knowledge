---
Source:
  - https://www.youtube.com/watch?v=AqQpquOCL6A
Reviewed: false
---
- ![[Screenshot 2025-01-02 at 1.07.00 PM.png]]
	- Additive and Multiplicative Principles
		- We usually write numbers in decimal form (or base 10), meaning numbers are composed using 10 different "digits" {0, 1, 2, 3, 4, 5, 6, 7, 8, 9}. Sometimes though it is useful to write numbers [[hexadecimal]]  or base 16. Now there are 16 distinct digits that can be used to form numbers: {0, 1, ...., 9, A, B, C, D, E, F}. For example, a 3-digit hexadecimal number might be 2B8. How many 2-digit hexadecimals are there in which the first digit is A, B, or C?
			- Calculate your answer using both the additive and multiplicative methods
			- #question what makes hexadecimal numbers useful?
			- In 2B8
				- 8 is in the $16^0$ or 1s place value
				- B is in $16^1$ or 16s place value
				- 2 is in the $16^2$ or 256s place value
			- When we say "first digit" we are referring to the digit on the left
		- Additive Method (using [[additive principle]]):
			- Can think of this one as cases
			- 16 + 16 + 16 = 48
				- The 16 comes from the number of choices where A is the first digit and then the other 16s are for the ways for B and C
		- Multiplicative Method (using [[multiplicative principle]]):
			- Can think of this as two events
				- First event is selecting first digit (A, B, or C)
					- 3 ways
			- Second event is to select the second digit that has no restriction
				- 16 choices (for 0 through F)
	- Second
		- How many 3-digit hexadecimals start with B-D and end with 0-5?
			- First digit has 3 ways (B-D), second digit has 16 ways (0-F) and third digit has 6 ways (0-5)
		- How many 3-digit hexadecimals start with B-D or end with 0-5?
			- (Start with B-D) + (End with 0-5) - (Start with B-D and End with 0-5)
				- (1)
					- 3 choices for first digit + 16 possibilities + 16 possibilities of whichever digit (0-F)
				- (2)
					- We need a restriction on the first digit for (end with 0-5) because the first digit can't be 0 since then it would just be a 2-digit hexadecimal
				- (3)
					- Solution that we got from above (and to avoid repeat ways)
		- $|A \cup B| = |A| + |B| - |A \cap B|$ 
			- Cardinality of a union when sets are not disjoint