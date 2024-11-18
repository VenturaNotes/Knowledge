[Video](https://youtube.com/watch?v=KcEHMjN_BXo)

- ![[Screenshot 2024-01-23 at 12.59.47 AM.png]]
	- Slide 2 - Learning Objectives
		- By the end of this session, participants should be able to:
			- Produce a valid binary representation of a positive integer, by using recursion
	- Slide 3 - (1) [[Strong induction]]
	-  Slide 4 - (2) [[Binary representation]]
		- Also can't repeat the same exponent
			- "distinct non-negative integer powers of 2"
		- Major idea: [[Odd numbers]] n + 1 relate to n by adding $2^0$. [[Even number|Even numbers]] n + 1 relate to $\frac{n + 1}{2}$ by removing one from each power
	- Slide 5 - Proof
		- Proof. We use strong induction
		- [[Base case]]: Note that 1 = $2^0$, which is a valid binary representation
		- [[Induction]]: Suppose that 1, 2, ..., n all have valid binary representations for a particular n $\in \mathbb{N}$
- ![[Screenshot 2024-01-23 at 1.03.59 AM.png]]
	- Slide 6 - (3) Proof
		- Case 1, n is [[even]]
			- By the IH, n has a valid binary representation. Since n is even, in fact, none of the exponents are 0. Therefore (equation) which is a valid binary representation
	- Slide 7 - (3) Proof
		- Case 2, n is [[odd]]
	- Slide 8 - Reflection
		- Why did we use $a_1, a_2, ..., a_k$ for the exponents in this proof? Is there a simpler way to prove this?
		- In case 2, how did we know that 1 $\le$ m $\le$ n?
		- Are there multiple ways to represent a number in binary?
		- Extract a construction from the proof that produces the binary representation of 52