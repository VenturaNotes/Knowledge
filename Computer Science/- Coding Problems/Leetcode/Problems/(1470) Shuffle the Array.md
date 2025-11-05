---
Source:
  - https://leetcode.com/problems/shuffle-the-array/
Reviewed: false
---
## Synthesis
### My Source
```python
class Solution:
    def shuffle(self, nums: List[int], n: int) -> List[int]:
        shuffle = []

        l = 0
        r = int(len(nums) / 2)
        for i in range(int(len(nums)/2)):
            shuffle.append(nums[l])
            shuffle.append(nums[r])
            l+=1
            r+=1
        return shuffle
```
## Source [^1]
- 
## References

[^1]: 