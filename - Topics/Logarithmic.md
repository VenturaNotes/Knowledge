## Synthesis
- When an algorithm is described as algorithmic, it means its time complexity is $O(logN)$. This means the number of operations the algorithm performs grows very slowly as the input size increases. 
	- The $logN$ (usually base 2, or $log_2N$ for computer science) represents the number of times you can divide N by 2 until you reach 1
		- So if you have a 1000 page dictionary $log_2 (1000) \approx 10$ which means it will only take about 10 steps to find the word you're looking for
			- $\frac{1000} {2^{10}} \approx 0.976$ 
	- Typically, if you double the input size $(N)$, the number of operations does not double, instead it only increases by a small, constant amount (specifically, by 1 if it's $log_2N$)
		- Finding a word in 2000 pages would take 11 steps maximum
		- Finding a word in 1 million pages would take about 20 steps maximum
- Why logarithmic search is important when looking for a word in dictionary
	- Linear Search: $O(N)$ time because if the dictionary had 1000 pages, you might check up to 1000 pages. Same with 2000 pages. The efforts grows directly with the size
	- Logarithmic Search: $O(log N)$ time because you keep halving the search space until you find the number. You open the book in the middle. If the name is before, you discard the other half. Then check the middle again and continue doing it until you find the word or not. 
### What Makes an Algorithm Logarithmic?
- An algorithm is logarithmic because it employs a strategy that reduces the problem size by a constant factor (often by half) which each step or iteration. Common characteristics that lead to logarithmic complexity include
	- [[Divide and Conquer]]
		- Problem is repeatedly broken down into smaller subproblems, and only one of these subproblems needs to be solved in the next step
	- [[Binary Search]]
		- A sorted list is repeatedly halved to find an element
	- [[Tree traversal]] ([[balanced tree|balanced trees]])
		- Operations like searching or inserting in a balanced binary search tree often take $O(logN)$ time because at each level of the tree, you're essentially choosing one path out of two, effectively halving the remaining search space
- This algorithm's efficiency comes from quickly eliminating a large portion of the remaining data with each decision. 
## Source [^1]
- 
## References

[^1]: