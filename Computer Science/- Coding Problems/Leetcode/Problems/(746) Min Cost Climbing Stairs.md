---
Source:
  - https://leetcode.com/problems/min-cost-climbing-stairs/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-24 at 2.18.19 AM.png]]
- Can't be greedy with this problem
- [[decision tree]] great to draw when brute forcing
- The max height of this tree is `n = length of cost array`
	- And we know that we could have 2 branches for every single node
	- So time complexity comes to $O(2^n)$ 
- We could get time complexity to $O(n)$ due to repeated work
- Can [[cache]] the recursive solution to get an iterative solution with same time and memory complexity
- Will also be $O(n)$ complexity for memory
- We can only start at index 0 or index 1. Can't start at index 2 or top of stair case
	- Could use memory complexity of $O(1)$ 
```python
class Solution:
    def minCostClimbingStairs(self, cost: List[int]) -> int:
        cost.append(0)

        for i in range(len(cost) - 3, -1, -1):
            cost[i] += min(cost[i+1], cost[i+2])
        
        # Guaranteed that cost array has at least 2 values
        return min(cost[0], cost[1])
```
## References

[^1]: https://www.youtube.com/watch?v=ktmzAZWkEZ0