---
Source:
  - https://leetcode.com/problems/search-in-rotated-sorted-array/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Pasted image 20241109040805.png]]
	- Suppose an array sorted in ascending order is rotated at some pivot unknown to you beforehand
	- You are given a target value to search. If found in the array, return its index, otherwise return -1. No duplicates in array. Runtime complexity should be $O(logn)$
	- Could just traverse the list giving a time complexity of $O(n)$
	- Will use [[binary search]] here
		- Usually has left, right and middle pointer
		- Left always $\le$ right
	- Many discrete cases for this problem
```python
class Solution:
    def search(self, nums: List[int], target: int) -> int:
        l, r = 0, len(nums) - 1

		# Checking equals because could be given an array with 1 element
        while l <= r:
            mid = (l + r) // 2
            if target == nums[mid]:
                return mid
            
            # left sorted portion
            # Doesn't seem like we need the equal to here? It still pases test 
            # on neetcode
            if nums[l] <= nums[mid]:
                if target > nums[mid] or target < nums[l]:
                    l = mid + 1
                else:
                    r = mid - 1
            
            # right sorted portion
            else:
                if target < nums[mid] or target > nums[r]:
                    r = mid - 1
                else:
                    l = mid + 1
        return -1
```

## Source[^2]
### (1) Brute Force
```python
class Solution:
    def search(self, nums: List[int], target: int) -> int:
        for i in range(len(nums)):
            if nums[i] == target:
                return i
        return -1
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$

### (2) Binary Search
```python
class Solution:
    def search(self, nums: List[int], target: int) -> int:
        l, r = 0, len(nums) - 1

        while l < r:
            m = (l + r) // 2
            if nums[m] > nums[r]:
                l = m + 1
            else:
                r = m

        pivot = l
        
        def binary_search(left: int, right: int) -> int:
            while left <= right:
                mid = (left + right) // 2
                if nums[mid] == target:
                    return mid
                elif nums[mid] < target:
                    left = mid + 1
                else:
                    right = mid - 1
            return -1

        result = binary_search(0, pivot - 1)
        if result != -1:
            return result
        
        return binary_search(pivot, len(nums) - 1)
```
Time Complexity: $O(logn)$
Space Complexity: $O(1)$

### (3) Binary Search (Two Pass)
```python
class Solution:
    def search(self, nums: List[int], target: int) -> int:
        l, r = 0, len(nums) - 1

        while l < r:
            m = (l + r) // 2
            if nums[m] > nums[r]:
                l = m + 1
            else:
                r = m

        pivot = l
        l, r = 0, len(nums) - 1

        if target >= nums[pivot] and target <= nums[r]:
            l = pivot
        else:
            r = pivot - 1

        while l <= r:
            m = (l + r) // 2
            if nums[m] == target:
                return m
            elif nums[m] < target:
                l = m + 1
            else:
                r = m - 1

        return -1
```
Time Complexity: $O(logn)$
Space Complexity: $O(1)$

### (4) Binary Search (One Pass)
```python
class Solution:
    def search(self, nums: List[int], target: int) -> int:
        l, r = 0, len(nums) - 1

        while l <= r:
            mid = (l + r) // 2
            if target == nums[mid]:
                return mid

            if nums[l] <= nums[mid]:
                if target > nums[mid] or target < nums[l]:
                    l = mid + 1
                else:
                    r = mid - 1
                    
            else:
                if target < nums[mid] or target > nums[r]:
                    r = mid - 1
                else:
                    l = mid + 1
        return -1
```
Time Complexity: $O(logn)$
Space Complexity: $O(1)$
## References

[^1]: https://www.youtube.com/watch?v=U8XENwh8Oy8
[^2]: https://neetcode.io/solutions/search-in-rotated-sorted-array