---
Source:
  - https://leetcode.com/problems/number-of-sub-arrays-of-size-k-and-average-greater-than-or-equal-to-threshold/
Reviewed: false
Approaches: "1"
---
## Synthesis
- Given
	- `arr` = array of integers
	- `k` = integer
	- `threshold` = integer
- Return the number of sub-arrays 
	1. of size `k` 
	2. average greater than or equal to `threshold`.

**Example 1:**

```
Input: arr = [2,2,2,2,5,5,5,8], k = 3, threshold = 4
Output: 3
Explanation: Sub-arrays [2,5,5],[5,5,5] and [5,5,8] have averages 4, 5 and 6 respectively. All other sub-arrays of size 3 have averages less than 4 (the threshold).
```

**Example 2:**

```
Input: arr = [11,13,17,23,29,31,7,5,2,3], k = 3, threshold = 5
Output: 6
Explanation: The first 6 sub-arrays of size 3 have averages greater than 5. Note that averages are not integers.
```

**Constraints:**

- $1 \le \text{arr.length} \le 10^5$
- $1 \le arr[i] \le 10^4$
- $1 \le k \le \text{arr.length}$
- $0 \le \text{threshold} \le 10^4$ 

### Solution 1
```python
class Solution:
    def numOfSubarrays(self, arr: List[int], k: int, threshold: int) -> int:
        total = 0

        # Initial
        previous = sum(arr[:k])/k
        if previous >= threshold:
            total += 1
		
        for i in range(k, len(arr)):
            previous = ((previous*k) - arr[i-k] + arr[i])/k
            print(previous)
            if previous >= threshold:
                total += 1

        return total
```
## Source [^1]
- 
## References

[^1]: 