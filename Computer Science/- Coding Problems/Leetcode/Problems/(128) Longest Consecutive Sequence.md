---
Source:
  - https://leetcode.com/problems/longest-consecutive-sequence/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Pasted image 20241014191421.png]]
- Want to know the longest consecutive sequence we can make from the input array.
- We could use the sorting solution which would be a time complexity of O(nlogn). This is because sorting is $O(nlogn)$ 
- By placing the numbers on a number line, we notice that there are 3 distinct sequences
- Can get the start of a sequence by checking array of numbers and figuring out which numbers do not have a left neighbor.
- Take initial array and convert it into a set.
- Just need to iterate through initial array, use a set, check if values have left neighbors. If they didn't, then they were the start of sequences. Made problem so easy using only one data structure.
- Only had to iterate through entire array and expand each range, we know we're only going to visit each number at most twice. So our solution is very efficient
- Needed to use additional memory using a set to check if additional neighbors existed.
- Time: O(n)
- Memory: O(n)
- This is a linear time solution and a linear complexity solution
```python
class Solution:
	def longestConsecutive(self, nums: List[int]) -> int:
		numSet = set(nums) #set constructor
		longest = 0

		for n in nums:
			# check if its the start of a sequence
			if (n - 1) not in numSet:
				length = 0
				while (n + length) in numSet:
					length += 1
				longest = max(length, longest)
		return longest
```
- Dry Run of Code above
	- Let's use the numbers \[100, 4, 200, 1, 3, 2]. 
		- So longest = 0. We check in the loop if 100 is not in numSet which is true as 99 does not exist
		- Then we check if 100 + length is in numSet. Not true so we move on to next number
		- 4 doesn't work because 3 in numSet
		- 200 is analyzed similar to 100
		- 1 is found to work because 2, 3, and 4 are in set. 
## Source[^2]
### (1) Brute Force
```python
class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        res = 0
        store = set(nums)

        for num in nums:
            streak, curr = 0, num
            while curr in store:
                streak += 1
                curr += 1
            res = max(res, streak)
        return res
```
Time Complexity: $O(n^2)$
Space Complexity: $O(n)$

### (2) Sorting
```python
class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        if not nums:
            return 0
        res = 0
        nums.sort()
        
        curr, streak = nums[0], 0
        i = 0
        while i < len(nums):
            if curr != nums[i]:
                curr = nums[i]
                streak = 0
            while i < len(nums) and nums[i] == curr:
                i += 1
            streak += 1
            curr += 1
            res = max(res, streak)
        return res
```
Time Complexity: $O(nlogn)$
Space Complexity: $O(1)$

### (3) Hash Set
```python
class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        numSet = set(nums)
        longest = 0

        for num in numSet:
            if (num - 1) not in numSet:
                length = 1
                while (num + length) in numSet:
                    length += 1
                longest = max(length, longest)
        return longest
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$

### (4) Hash Map
```python
class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        mp = defaultdict(int)
        res = 0

        for num in nums:
            if not mp[num]:
                mp[num] = mp[num - 1] + mp[num + 1] + 1
                mp[num - mp[num - 1]] = mp[num]
                mp[num + mp[num + 1]] = mp[num]
                res = max(res, mp[num])
        return res
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
## References

[^1]: [Leetcode 128 - LONGEST CONSECUTIVE SEQUENCE](https://www.youtube.com/watch?v=P6RZZMu_maU)
[^2]: https://neetcode.io/solutions/longest-consecutive-sequence