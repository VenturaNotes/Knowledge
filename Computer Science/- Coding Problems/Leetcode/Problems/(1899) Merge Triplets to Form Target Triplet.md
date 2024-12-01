---
Source:
  - https://leetcode.com/problems/merge-triplets-to-form-target-triplet/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-30 at 3.25.45 AM.png]]
- Do not consider arrays that have a value at an index greater than the value of the same index for the target array
- Code: Go through list of triplets, filter out triplets that have a value greater than any value in target, then will check among any triplet to see if we can reach target values, then we'll return True
- It is an $O(n)$ time solution where we iterate through every single triplet
```python
class Solution:
    def mergeTriplets(self, triplets: List[List[int]], target: List[int]) -> bool:
        good = set()

        for t in triplets:
            if t[0] > target[0] or t[1] > target[1] or t[2] > target[2]:
                continue
            
            for i, v in enumerate(t):
                if v == target[i]:
                    good.add(i)
        return len(good) == 3
```
## References

[^1]: https://www.youtube.com/watch?v=kShkQLQZ9K4