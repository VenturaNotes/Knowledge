---
Source:
  - https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Pasted image 20241014195113.png]]
- #question I wish we could see a proof for why this would always work.
- For worst case scenario, our time complexity is $O(n^2)$ 
	- This is when we check the first number and compare it with the other numbers
- Big factor for this problem is that the array is sorted
- Time complexity will just be O(n)
	- Found a linear algorithm using two pointers to solve this problem. Don't even need extra memory
```python
class Solution:
	def twoSum(self, numbers: List[int], target: int) -> List[int]:
		l,r = 0, len(numbers) - 1

		while l < r:
			curSum = numbers[l] + numbers[r]

			if curSum > target:
				r -= 1
			elif curSum < target:
				l += 1
			else:
				return [l + 1, r + 1]
		return []
```
- Since we are guaranteed a solution from this sorted array, we will find a solution
## Source[^2]
### (1) Brute Force
```python
class Solution:
    def twoSum(self, numbers: List[int], target: int) -> List[int]:
        for i in range(len(numbers)):
            for j in range(i + 1, len(numbers)):
                if numbers[i] + numbers[j] == target:
                    return [i + 1, j + 1]
        return []
```
Time Complexity: $O(n^2)$
Space Complexity: $O(1)$

### (2) Binary Search
```python
class Solution:
    def twoSum(self, numbers: List[int], target: int) -> List[int]:
        for i in range(len(numbers)):
            l, r = i + 1, len(numbers) - 1
            tmp = target - numbers[i]
            while l <= r:
                mid = l + (r - l)//2
                if numbers[mid] == tmp:
                    return [i + 1, mid + 1]
                elif numbers[mid] < tmp:
                    l = mid + 1
                else:
                    r = mid - 1
        return []
```
Time Complexity: $O(nlogn)$
Space Complexity: $O(1)$

### (3) Hash map
```python
class Solution:
    def twoSum(self, numbers: List[int], target: int) -> List[int]:
        mp = defaultdict(int)
        for i in range(len(numbers)):
            tmp = target - numbers[i]
            if mp[tmp]:
                return [mp[tmp], i + 1]
            mp[numbers[i]] = i + 1
        return []
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
### (4) Two Pointers
```python
class Solution:
    def twoSum(self, numbers: List[int], target: int) -> List[int]:
        l, r = 0, len(numbers) - 1

        while l < r:
            curSum = numbers[l] + numbers[r]

            if curSum > target:
                r -= 1
            elif curSum < target:
                l += 1
            else:
                return [l + 1, r + 1]
        return []
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$
## References

[^1]: [TWO SUM II - Amazon Coding Interview Question - Leetcode 167 - Python](https://www.youtube.com/watch?v=cQ1Oz4ckceM)
[^2]: https://neetcode.io/solutions/two-sum-ii-input-array-is-sorted