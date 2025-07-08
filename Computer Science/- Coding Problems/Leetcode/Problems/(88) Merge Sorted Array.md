---
Source:
  - https://leetcode.com/problems/merge-sorted-array/
Reviewed: false
---
## Synthesis[^1]
### My Solution
```python
class Solution:
    def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:
        """
        Do not return anything, modify nums1 in-place instead.
        """
        test = [0]*(m+n)
        j = 0
        k = 0
        for i in range(len(nums1)):
            if m > j and n > k:
                if nums1[j] <= nums2[k]:
                    test[i] = nums1[j]
                    j+=1
                else:
                    test[i] = nums2[k]
                    k+=1
            else:
                if m > j:
                    test[i] = nums1[j]
                    j+=1
                elif n > k:
                    test[i] = nums2[k]
                    k+=1
        for i in range(len(nums1)):
            nums1[i] = test[i]
```

### Alternative Solution
```pyth
```

## Source [^1]
- 
## References

[^1]: https://leetcode.com/problems/merge-sorted-array/solutions/3436053/beats-100-best-c-java-python-and-javascript-solution-two-pointer-stl/?envType=study-plan-v2&envId=top-interview-150