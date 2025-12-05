---
Source:
  - https://leetcode.com/problems/shuffle-the-array/
Reviewed: false
Approaches: "1"
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
#### Alternative
```python
class Solution:
    def shuffle(self, nums: List[int], n: int) -> List[int]:
        new_list = []
        for i in range(int(len(nums)/2)):
            new_list.append(nums[i])
            new_list.append(nums[int(len(nums)/2+i)])
        return new_list
```
- Probably too many `len()` recalculations
## Source [^1]
- 
## References

[^1]: 