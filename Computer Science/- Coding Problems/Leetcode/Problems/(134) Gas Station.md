---
Source:
  - https://leetcode.com/problems/gas-station/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-30 at 3.11.06 AM.png|500]]
- Greedy problem
- Will only be one unique solution
- Sum of gas array must be greater than or equal to the sum of the cost array
- Greedy problems can be tricky because it's either you know it or don't
- Greed explanation: If you're able to make it to end of array and sum(gas) $\ge$ sum(cost), you've found your unique solution as there will always be guaranteed a solution
	- Time complexity: $O(n)$
	- Memory complexity: $O(1)$
```python
class Solution:
    def canCompleteCircuit(self, gas: List[int], cost: List[int]) -> int:
        if sum(gas) < sum(cost):
            return -1
        
        total = 0
        res = 0
        for i in range(len(gas)):
            total += (gas[i] - cost[i])

            if total < 0:
                total = 0
                res = i + 1
        return res

```
## References

[^1]: https://www.youtube.com/watch?v=lJwbPZGo05A