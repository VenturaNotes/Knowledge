---
Source:
  - https://leetcode.com/problems/find-the-duplicate-number/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-20 at 5.52.26 PM.png]]
- Seems like this problem shows up a lot in interviews
- Floyd came up with this algorithm
- Not allowed to modify the array `nums` and uses only constant extra space
- Use a [[HashSet]], find the one that occurs twice.
	- This will be O(n) time and O(n) memory
	- Can't even modify input array (meaning we can't sort it)
- This is a [[linked list cycle]] problem
- Need to know Floyd's algorithm?
	- Helps find the beginning of a cycle 
- There is `n` different values but `n+1` positions
- We can guarantee the first node won't be part of cycle?
- Slow pointer making 1 jump and fast pointer making 2 jumps
	- First we find first position they intersect at
	- Then we take first slow pointer and set a second slow pointer at beginning of linked list
	- Then shifting by 1 until they intersect one more time.
	- The second point of intersection will always be the result
	- The distance between the first intersection point and the beginning of the cycle is always the same as the starting point distance from the start of the cycle. This is also 1
		- Remaining portion of cycle is C (length of cycle) - x
	- Using the equation shown, we proved that $p=x$ 
		- This is a very rigorous proof shown. Will always work
- Zero not part of cycle
- It's a linear time solution O(n) and didn't modify the input array so space complexity (O(1))
```python
class Solution:
    def findDuplicate(self, nums: List[int]) -> int:
        slow, fast = 0, 0
        while True:
            slow = nums[slow]
            fast = nums[nums[fast]]
            if slow == fast:
                break
        
        slow2 = 0
        while True:
            slow = nums[slow]
            slow2 = nums[slow2]
            if slow == slow2:
                return slow
```
## Source[^2]
### (1) Sorting
```python
class Solution:
    def findDuplicate(self, nums: List[int]) -> int:
        nums.sort()
        for i in range(len(nums) - 1):
            if nums[i] == nums[i + 1]:
                return nums[i]
        return -1
```
Time Complexity: $O(nlogn)$
Space Complexity: $O(1)$ or $O(n)$ depending on the sorting algorithm

### (2) Hash Set
```python
class Solution:
    def findDuplicate(self, nums: List[int]) -> int:
        seen = set()
        for num in nums:
            if num in seen:
                return num
            seen.add(num)
        return -1
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
### (3) Array
```python
class Solution:
    def findDuplicate(self, nums: List[int]) -> int:
        seen = [0] * len(nums)
        for num in nums:
            if seen[num - 1]:
                return num
            seen[num - 1] = 1
        return -1
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
### (4) Negative Marking
```python
class Solution:
    def findDuplicate(self, nums: List[int]) -> int:
        for num in nums :
            idx = abs(num) - 1 
            if nums[idx] < 0 :
                return abs(num)
            nums[idx] *= -1
        return -1
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$

### (5) Binary Search
```python
class Solution:
    def findDuplicate(self, nums: List[int]) -> int:
        n = len(nums)
        low, high = 1, n - 1
        while low < high:
            mid = low + (high - low) // 2
            lessOrEqual = sum(1 for num in nums if num <= mid)

            if lessOrEqual <= mid:
                low = mid + 1
            else:
                high = mid

        return low
```
- Time Complexity:$O(nlogn)$
- Space Complexity: $O(1)$
### (6) Bit Manipulation
```python
class Solution:
    def findDuplicate(self, nums: List[int]) -> int:
        n = len(nums)
        res = 0
        for b in range(32):
            x = y = 0
            mask = 1 << b
            for num in nums:
                if num & mask:
                    x += 1
            
            for num in range(1, n):
                if num & mask:
                    y += 1
            
            if x > y:
                res |= mask
        return res
```
Time Complexity: $O(32*n)$
Space Complexity: $O(1)$

### (7) Fast And Slow Pointers
```python
class Solution:
    def findDuplicate(self, nums: List[int]) -> int:
        slow, fast = 0, 0
        while True:
            slow = nums[slow]
            fast = nums[nums[fast]]
            if slow == fast:
                break

        slow2 = 0
        while True:
            slow = nums[slow]
            slow2 = nums[slow2]
            if slow == slow2:
                return slow
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$
## References

[^1]: https://www.youtube.com/watch?v=wjYnzkAhcNk
[^2]: https://neetcode.io/solutions/find-the-duplicate-number