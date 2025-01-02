---
Source:
  - https://leetcode.com/problems/climbing-stairs/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-24 at 2.07.57 AM.png]]
- Taking brute force and using [[memoization]] and then getting the true [[dynamic programming ]]solution
- Using a [[decision tree]] will help us see the patterns needed
	- If used [[Depth first search|DFS]] with recursion, the time complexity would end up being $2^n$ 
	- However, we see that we're repeating the same problem multiple times
	- Can just take that result `2` and store it in memory or `DP` where basically it's a cache
		- We're storing it in memory so we don't need to draw out the new decision tree again
- We see that we solve the same problem multiple times which isn't a good thing
- Only solving each sub-problem once meaning that we're solving it in $O(n)$ time
	- We have sub-problems of 0, 1, 2, 3, 4, all the way to 5 (which is our base case)
- We [[cache]] the result. AKA, [[memoization]].
- But this problem can be solved with a true [[dynamic programming]] solution
	- We see that starting at the result, the result of 0 depends on the subproblem.
		- We could solve the base case and work our way up to the original problem at 0
			- This is called a [[bottom-up dynamic programming]] approach
			- Will start at base case and work our way up
- This is similar to the [[Fibonacci Numbers]]
	- Adding two values to get the next result
- Using extra memory $O(n)$ 
	- In reality, we just need two different variables
		- two variables can be shifted $n-1$ times
```python
class Solution:
    def climbStairs(self, n: int) -> int:
        one, two = 1, 1

        for i in range(n-1):
            temp = one
            one = one + two
            two = temp
        
        return one
```
## References

[^1]: https://www.youtube.com/watch?v=Y0lT9Fck7qI