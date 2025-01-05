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
## Source[^2]
### (1) Recursion
```python
class Solution:
    def climbStairs(self, n: int) -> int:
        
        def dfs(i):
            if i >= n:
                return i == n
            return dfs(i + 1) + dfs(i + 2)
            
        return dfs(0)
```
Time Complexity: $O(2^n)$
Space Complexity: $O(n)$

### (2) Dynamic Programming (Top-Down)
```python
class Solution:
    def climbStairs(self, n: int) -> int:
        cache = [-1] * n
        def dfs(i):
            if i >= n:
                return i == n
            if cache[i] != -1:
                return cache[i]
            cache[i] = dfs(i + 1) + dfs(i + 2)
            return cache[i]
            
        return dfs(0)
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
### (3) Dynamic Programming (Bottom-Up)
```python
class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 2:
            return n
        dp = [0] * (n + 1)
        dp[1], dp[2] = 1, 2
        for i in range(3, n + 1):
            dp[i] = dp[i - 1] + dp[i - 2]
        return dp[n]
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$

### (4) Dynamic Programming (Space Optimized)
```python
class Solution:
    def climbStairs(self, n: int) -> int:
        one, two = 1, 1

        for i in range(n - 1):
            temp = one
            one = one + two
            two = temp
        
        return one
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$

### (5) Matrix Exponentiation
```python
class Solution:
    def climbStairs(self, n: int) -> int:
        if n == 1:
            return 1

        def matrix_mult(A, B):
            return [[A[0][0] * B[0][0] + A[0][1] * B[1][0], 
                     A[0][0] * B[0][1] + A[0][1] * B[1][1]],
                    [A[1][0] * B[0][0] + A[1][1] * B[1][0], 
                     A[1][0] * B[0][1] + A[1][1] * B[1][1]]]

        def matrix_pow(M, p):
            result = [[1, 0], [0, 1]]  
            base = M

            while p:
                if p % 2 == 1:
                    result = matrix_mult(result, base)
                base = matrix_mult(base, base)
                p //= 2

            return result

        M = [[1, 1], [1, 0]]
        result = matrix_pow(M, n)
        return result[0][0]
```
Time Complexity: $O(logn)$
Space Complexity: $O(1)$

### (6) Math
```python
class Solution:
    def climbStairs(self, n: int) -> int:
        sqrt5 = math.sqrt(5)
        phi = (1 + sqrt5) / 2
        psi = (1 - sqrt5) / 2
        n += 1
        return round((phi**n - psi**n) / sqrt5)
```
Time Complexity: $O(logn)$
Space Complexity: $O(1)$
## References

[^1]: https://www.youtube.com/watch?v=Y0lT9Fck7qI
[^2]: https://neetcode.io/solutions/climbing-stairs