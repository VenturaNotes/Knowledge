---
Source:
  - https://leetcode.com/problems/sort-even-and-odd-indices-independently/
Reviewed: false
---
## Synthesis
### My Solution Variation 1
- Details
	- A 0-indexed array just means that the array index starts at 0
	- Non-increasing (so numbers don't go up. So stagnant or go down)
	- Non-decreasing (means stays the same or goes up)
	- Probably use some sort of merge sorting for best sorting time
```python
class Solution:
    def sortEvenOdd(self, nums: List[int]) -> List[int]:
        even = []
        odd = []
        total = []

        for i in range(len(nums)):
            if i % 2 == 0:
                even.append(nums[i])
            else:
                odd.append(nums[i])

        even.sort()
        odd.sort(reverse=True)
        for i in range(len(nums)):
            if i % 2 == 0:
                total.append(even.pop(0))
            else:
                total.append(odd.pop(0))
        return total
```
- Description
	- n = length of `nums`
	- First I create 3 empty lists where 
		- even holds the even numbers
		- odd holds the odd numbers
		- total holds the result numbers
			- It would actually be an improvement to do `result = [0] * len(nums)` to pre-allocate the result array for efficiency because it will always be one length.
				- #question Why is this more efficient than just doing `result = []`?
	- First loop
		- Time Complexity: O(n)
		- Adds each number into either an even or odd index
	- The sorting algorithms run at $O(NlogN)$ complexity
	- Afterwards, I pop the elements into the result.
		- However, it's bad to call `pop(0)` because this part could degrade to $O(N^2)$ worst case
			- The reason for this is because `list.pop(0)` has a time complexity of $O(K)$, where $K$ is the current length of the list, because it requires shifting all subsequent elements. 
		- Instead, should use index-based access or two pointers to iterate through the sorted lists. This would bring the merging step to $O(N)$
### My Solution Variation 2
```python
class Solution:
    def sortEvenOdd(self, nums: List[int]) -> List[int]:
        even = []
        odd = []
        total = [0] * len(nums)

        for i in range(len(nums)):
            if i % 2 == 0:
                even.append(nums[i])
            else:
                odd.append(nums[i])

        even.sort()
        odd.sort(reverse=True)

        even_pointer = 0
        odd_pointer = 0
        for i in range(len(nums)):
            if i % 2 == 0:
                total[i] = even[even_pointer]
                even_pointer += 1
            else:
                total[i] = odd[odd_pointer]
                odd_pointer += 1
        return total
```
- Complexity
	- Time: $O(NlogN)$
	- Space: $O(N)$
- Stats (don't use this. Inconsistent)
	- Beats 100% Runtime
		- Another run says 37.84% runtime
	- Beast 12.27% Memory
		- Another run says beats 32.85% of memory
- Changes
	- Gave `total` a default size and traversed based on index
	- Used two pointers to change the values of the elements in `total` from the `even` and `odd` lists
- #question What would the counting sort solution look like

### Solution 3
- For counting sort, the numbers in `nums` are typically within a limited range (1 to 100 or 1 to 1000). This limited range `K` makes counting sort viable. 
- Steps
	- (1) First we find the maximum possible value `K` any number in `nums` can take. This will determine the size of our counting arrays. 
	- (2) Instead of putting numbers in two separate lists and sorting them, we use two counting arrays. 
		- `even_counts:` Stores # of times `x` appeared at an even index in original `nums`
		- `odd_counts:`
- Complexity
	- Time: $O(N+K)$
	- Space: $O(N+K)$ 
## Source [^1]
- 
## References

[^1]: 