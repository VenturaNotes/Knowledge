---
Source:
  - https://leetcode.com/problems/merge-sorted-array/
Reviewed: false
---
## Synthesis
- Goal: Sort the two arrays inside the first array in non-decreasing order
### My Solution
```python
class Solution:
    def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:
        """
        Do not return anything, modify nums1 in-place instead.
        """
        # Create array same length as nums1
        test = [0]*(m+n)

		# Create two pointers that both start at zero-th index
        j = 0
        k = 0
        # Loop through each index in nums1
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
- This takes extra time and space than the below solution
	- First it creates an (n+m) space
	- Then it goes through the entire array
	- Then it copies that array from `test` to `nums1`

### Alternative Solution [^1]
```python
class Solution:
    def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:
        """
        Do not return anything, modify nums1 in-place instead.
        """
        i = m - 1 # Gets the 'm' index of nums1
        j = n - 1 #Gets the 'n' index of nums2
        k = m + n - 1 # Need "-1" to place largest element at end of array
        
        while j >= 0:
            if i >= 0 and nums1[i] > nums2[j]:
                nums1[k] = nums1[i]
                i -= 1
            else:
                nums1[k] = nums2[j]
                j -= 1
            k -= 1
```
- Time Complexity: $O(m+n)$
- Space Complexity: $O(1)$
- Known as the Two Pointer approach
- ![[Screenshot 2025-07-13 at 8.48.53 AM.png]]

## Source
- 
## References

[^1]: https://leetcode.com/problems/merge-sorted-array/solutions/3436053/beats-100-best-c-java-python-and-javascript-solution-two-pointer-stl/?envType=study-plan-v2&envId=top-interview-150