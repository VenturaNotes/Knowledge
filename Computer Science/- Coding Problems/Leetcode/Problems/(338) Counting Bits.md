---
Source:
  - https://leetcode.com/problems/counting-bits/
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
## References

[^1]: https://www.youtube.com/watch?v=RyBM56RIWrM