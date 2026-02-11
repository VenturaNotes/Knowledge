---
Source:
  - https://leetcode.com/problems/remove-duplicates-from-sorted-array/
Reviewed: false
Approaches: "1"
---
## Synthesis
- Integer array in [[non-decreasing order]], remove duplicates in-place 
- Cases
	- The list only has 1 element inside: `7`
		- The length of the list would be 1 with index being 0
		- So $\le$ should probably be used
### My Solution
```python
class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        index = 1
        counter = 1
        while index + 1 <= len(nums):
            if nums[index] == nums[index-1]:
                nums.pop(index)
            else:
                counter += 1
                index += 1
        return counter
```
- Not great results
	- Better than 6.50% Runtime
	- Better than 8.07% Memory
- This code initializes the index and counter to = 1. Since one of the constraints is that there will always be one element within the list that's an integer, we know that there will always be at least one unique integer within the array. Then we just keep count of each successive unique element. 
- My solution only beat 6% of other submissions' runtime
- A down side with using this solution is that it requires I use a method within the list function instead of just modifying the elements without using a built-in function. 
## Source [^1]
```python
class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        i = 1

        for j in range(1, len(nums)):
            if nums[j] != nums[i - 1]:
                nums[i] = nums[j]
                i += 1
        
        return i
```
- This method uses two pointers
	- Time complexity $O(n)$
	- Space Complexity: $O(1)$
- Beats
	- 46.80% Runtime
	- 29.41% Memory
- #comment
	- ![[Screenshot 2025-10-18 at 1.18.45 AM.png]]
## Source[^2]
- 
## References

[^1]: https://leetcode.com/problems/remove-duplicates-from-sorted-array/solutions/5540670/video-use-two-pointers-coding-exercise/
[^2]: [Remove Duplicates from Sorted Array - Leetcode 26 - Python](https://www.youtube.com/watch?v=DEJAZBq0FDA)