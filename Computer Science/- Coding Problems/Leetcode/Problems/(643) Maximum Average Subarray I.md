---
Source:
  - https://leetcode.com/problems/maximum-average-subarray-i/
Reviewed: false
Approaches: "1"
---
## Synthesis
### Problem
- Given
	- Integer array `nums` with `n` elements
	- Integer `k`
- Find contiguous subarray whose length is equal to `k` that has the maximum average value and return this value. 
- Any answer with a calculation error less than $10^{-5}$ will be accepted.

**Example 1:**

```
Input: nums = [1,12,-5,-6,50,3], k = 4
Output: 12.75000
Explanation: Maximum average is (12 - 5 - 6 + 50) / 4 = 51 / 4 = 12.75
```

**Example 2:**

```
Input: nums = [5], k = 1
Output: 5.00000
```

**Constraints:**
- $n == \text{nums.length}$
- $1 \le k \le n \le 10^5$
- $-10^{4} \le \text{nums[i]} \le 10^4$ 

### Solution 1
```python
class Solution:
    def findMaxAverage(self, nums: List[int], k: int) -> float:
        max_average = 0
        previous_average = 0
        if len(nums) >= k:
            max_average = sum(nums[:k])/k
            previous_average = sum(nums[:k])/k
        for i in range(k, len(nums)):
            previous_average = ((previous_average*k)-nums[i-k] + nums[i])/k
            if previous_average > max_average:
                max_average = previous_average
        return max_average 
```
- I used fixed sliding window here
## Source [^1]
- 
## References

[^1]: 