---
Source:
  - https://www.youtube.com/watch?v=dVJREOBYWq8
Reviewed: false
---
- ![[Screenshot 2024-01-04 at 5.41.14 PM.png]]
	- Practice with [[Permutation|Permutations]] and [[Combination|Combinations]]
		- Permutations
			- All possible arrangements of a collection of things, where order is important
		- With combinations, the order does not matter
	- 2 types of permutations
		- (1) 
			- [[Permutations with repetition]]: Permutations where repeating numbers/objects is allowed
				- Example: Combination lock where a combination of "1, 1, 1, 1" would work
			- Formula: If we are choosing r of something that has n different possibilities, we will multiply n by itself r times, which will leave us with $n^r$ 
		- (2)
			- [[Permutations without repetition]]: Permutations where repeating numbers/objects is not allowed
				- Example: People running a race; one person cannot be first and second
				- Formula: $\frac {n!}{(n-r)!} = P(n, r)$
	- [[Combination|Combinations]]
		- Combinations: All possible arrangements of things, where the order doesn't matter (for permutations order mattered)
		- 2 types of Combinations
			- (1) Repetition is allowed: You can have multiples of the same object within your group
				- Example: Could be ice cream; 3 scoops are available in each cone but you could have two of one flavor and 1 of another
				- Formula: $r + n - 1 \choose r$$=\frac{(r+n-1)!}{r!(n-1)!}$
			- (2) Repetition is not allowed: You cannot have multiples of the same object within your group.
				- Example: The lottery, numbers are drawn one at a time, and if we have the numbers we win no matter what order they are in
				- Formula: $\frac{n!}{(n-r)!}*\frac{1}{r!}=\frac{n!}{r!(n-r)!}=$$n \choose r$
	- The n is how many objects we have and the r is how many we're choosing
- ![[Screenshot 2024-01-04 at 5.49.19 PM.png]]
	- Practice
		- (1) How many arrangements of the word ACTIVE are there if C and E must always be next to each other
			- Permutation problem
		- (2) How many ways can we arranged 8 people around a circular table?
		- (3) A coat hanger has four knobs, and each knob can be painted any color. If six colors of paint are available, how many ways can the knobs be painted?
			- This is permutation with repetition