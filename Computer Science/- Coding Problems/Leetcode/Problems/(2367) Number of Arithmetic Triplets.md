---
Source:
  - https://leetcode.com/problems/number-of-arithmetic-triplets/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def arithmeticTriplets(self, nums: List[int], diff: int) -> int:
        result = 0

        for i in range(0,len(nums)-2):
            for j in range(i+1,len(nums)-1):
                for k in range(j+1,len(nums)):
                    if nums[j] - nums[i] == diff and nums[k] - nums[j] == diff:
                        result +=1
        return result        

'''
nums = strictly increasing
diff = positive difference
(i,j,k) is an arithmetic triplet if conditions met. 
The arithmetic triplets represent indices.

I guess sliding window type of solution with 3 pointers?
'''
```
## Source [^1]
- 
## References

[^1]: 