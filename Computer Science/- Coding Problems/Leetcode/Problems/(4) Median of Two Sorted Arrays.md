---
Source:
  - https://leetcode.com/problems/median-of-two-sorted-arrays
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-16 at 12.16.53 AM.png]]
- Hard problem
- Two arrays in sorted order of size `m` and `n`. Need to return the median of the two sorted arrays. We want to put them together and find the median of both of them
- Overall time complexity should be O(log(m+n))
	- If you want a log algorithm, you need [[binary search]]
	- Goal to find median is to partition the array into left and right half evenly to find median
	- Left partition and right partition is exactly of size 6 in given example
- If we run binary search on bottom array (A), we can compute the size of the left partition for the second array. We can compute it using half value
- Take the minimum of left-most values in both partitions. So the min(4,5) = 4. 
- Take max value of left partition and min value of right partition to find medium in even array
```python
class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        A, B = nums1, nums2 #We want A to be smaller of 2 arrays
        total = len(nums1) + len(nums2)

		# Tells us total elements in left partition
        half = total // 2 #// for integer division

        if len(B) < len(A):
            A, B = B, A
        # Time complexity = Log(min(n, m))
        l, r = 0, len(A) - 1
        while True:
                i = (l + r) // 2 #A
                j = half - i - 2 #B (subtracting 2 b/c arrays indexed at 0)

				# Checking for bounds 
                Aleft = A[i] if i >= 0 else float("-infinity")
                Aright = A[i + 1] if (i + 1) < len(A) else float("infinity")
                Bleft = B[j] if j >= 0 else float ("-infinity")
                Bright = B[j + 1] if (j + 1) < len(B) else float("infinity")

                # partiton is correct
                if Aleft <= Bright and Bleft <= Aright:
                    # odd
                    if total % 2:
                        # both will never be infinity
                        return min(Aright, Bright)
                    # even
                    return (max(Aleft, Bleft) + min(Aright, Bright)) / 2
                elif Aleft > Bright:
                    r = i - 1
                else:
                    l = i + 1
```
## References

[^1]: https://www.youtube.com/watch?v=q6IEA26hvXc