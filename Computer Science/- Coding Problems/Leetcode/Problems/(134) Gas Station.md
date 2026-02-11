---
Source:
  - https://leetcode.com/problems/gas-station/
Reviewed: false
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
## Source[^2]
### (1) Brute Force
```python
class Solution:
    def canCompleteCircuit(self, gas: List[int], cost: List[int]) -> int:
        n = len(gas)

        for i in range(n):
            tank = gas[i] - cost[i]
            if tank < 0:
                continue
            j = (i + 1) % n
            while j != i:
                tank += gas[j]
                tank -= cost[j]
                if tank < 0:
                    break
                j += 1
                j %= n
            if j == i:
                return i
        return -1
```
Time Complexity: $O(n^2)$
Space Complexity: $O(1)$

### (2) Two Pointers
```python
class Solution:
    def canCompleteCircuit(self, gas: List[int], cost: List[int]) -> int:
        n = len(gas)
        start, end = n - 1, 0
        tank = gas[start] - cost[start]
        while start > end:
            if tank < 0:
                start -= 1
                tank += gas[start] - cost[start]
            else:
                tank += gas[end] - cost[end]
                end += 1
        return start if tank >= 0 else -1
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$

### (3) Greedy
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
Time Complexity: $O(n)$
Space Complexity: $O(1)$
## References

[^1]: [Gas Station - Greedy - Leetcode 134 - Python](https://www.youtube.com/watch?v=lJwbPZGo05A)
[^2]: https://neetcode.io/solutions/gas-station