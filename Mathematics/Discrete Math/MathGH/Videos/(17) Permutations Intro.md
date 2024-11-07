[Video](https://www.youtube.com/watch?v=vSoK3VEvpdQ)

- ![[Screenshot 2024-01-05 at 12.47.02 AM.png]]
	- [[Permutation|permutations]]
		- Description [^1]
	- Calculating Permutations
		- (1) [[Permutations with Repetition]]: Easiest to calculate
			- If something has n choices and we can choose any of them every time, so we have n choices each time.
			- General formula: If we are choosing r of something that has n different possibilities, we will multiply n by itself r times, which will leave us with $n^r$ 
			- Example: Consider a phone password where you choose 4 digits (the iPhone passcodes). Determine how many passcodes are possible.
		- (2) [[Permutations without repetition]]: For these problems, we must reduce the number of available choices each time
			- If something has n unique choices but does not allow for repetition, after choosing the first object only n-1 objects are available anymore
			- General formula (using factorial notation): Assume n is the number of things to choose from and we are choosing r of them, no repetitions, order matters
				- $\frac {n!}{(n-r)!} = P(n, r)$
			- Example: Consider a race with 10 runners. Determine how many different top 3 finish orders are possible.
				- Be comfortable with [[product principle]]
- ![[Screenshot 2024-01-05 at 12.50.33 AM.png]]
	- Practice
		- (1) How many permutations can we make withe the letters from the word "Car"
		- (2) How many arrangements can we make withe the letters from the word "Mississippi"
			- If you have k of the same item in a repetition, you divide the overall permutation by each of them multiplied by each other

## References
[^1]: [[(11) Practice with Permutations and Combinations]]