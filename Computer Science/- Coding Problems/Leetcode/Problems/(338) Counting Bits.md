---
Source:
  - https://leetcode.com/problems/counting-bits/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-12-08 at 9.42.17 PM.png]]
- Brute force way to solve this problem is $nlogn$ 
	- For any integer $n$, how many times can you divide it by 2? It's just $log_2n$. We're doing this for a bunch of integers (up to $n$) so we get the time complexity: $nlogn$ 
- There is some repeated work that we can eliminate that we can easily recognize when drawing out the bit mappings (the binary representations of a bunch of integers)
	- For that repeated work, we can get an $O(n)$ solution.
- This is a [[dynamic programming]] problem
- The offset is going to be the most significant that we have reached so for. The most significant bits are
	- `[1, 2, 4, 8, 16]`
		- Basically double size every single time
		- We know a bit is just a power of 2. That's what binary represents
```python
class Solution:
    def countBits(self, n: int) -> List[int]:
        dp = [0] * (n+1)
        ans = [0]
        offset = 1

        for i in range(1, n + 1):
            if offset * 2 == i:
                offset = i
            dp[i] = 1 + dp[i - offset]
        return dp
```
## Source[^2]
### (1) Bit Manipulation - I
```python
class Solution:
    def countBits(self, n: int) -> List[int]:
        res = []
        for num in range(n + 1):
            one = 0
            for i in range(32):
                if num & (1 << i):
                    one += 1
            res.append(one)
        return res
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$

### (2) Bit Manipulation - II
```python
class Solution:
    def countBits(self, n: int) -> List[int]:
        res = [0] * (n + 1)
        for i in range(1, n + 1):
            num = i
            while num != 0:
                res[i] += 1
                num &= (num - 1)
        return res
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$

### (3) In-Built Function
```python
class Solution:
    def countBits(self, n: int) -> List[int]:
        return [bin(i).count('1') for i in range(n + 1)]
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$

### (4) Bit Manipulation (DP)
```python
class Solution:
    def countBits(self, n: int) -> List[int]:
        dp = [0] * (n + 1)
        offset = 1

        for i in range(1, n + 1):
            if offset * 2 == i:
                offset = i
            dp[i] = 1 + dp[i - offset]
        return dp
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$

### (5) Bit Manipulation (Optimal)
```python
class Solution:
    def countBits(self, n: int) -> List[int]:
        dp = [0] * (n + 1)
        for i in range(n + 1):
            dp[i] = dp[i >> 1] + (i & 1)
        return dp
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$
## References

[^1]: https://www.youtube.com/watch?v=RyBM56RIWrM
[^2]: https://neetcode.io/solutions/counting-bits