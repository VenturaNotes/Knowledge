---
Source:
  - https://leetcode.com/problems/distribute-candies/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def distributeCandies(self, candyType: List[int]) -> int:
        unique_candies = len(set(candyType))
        
        if len(candyType)/2 > unique_candies:
            return unique_candies
        else:
            return int(len(candyType)/2)
```
## Source [^1]
- 
## References

[^1]: 