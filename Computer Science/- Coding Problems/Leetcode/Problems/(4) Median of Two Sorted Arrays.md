---
Source:
  - https://leetcode.com/problems/median-of-two-sorted-arrays
Reviewed: false
tags:
  - in-progress
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
## Source[^2]
### (1) Brute Force
```python
class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        len1 = len(nums1)
        len2 = len(nums2)
        merged = nums1 + nums2
        merged.sort()
        
        totalLen = len(merged)
        if totalLen % 2 == 0:
            return (merged[totalLen // 2 - 1] + merged[totalLen // 2]) / 2.0
        else:
            return merged[totalLen // 2]
```
Time Complexity: $O((n+m)log(n+m))$
Space Complexity: $O(n+m)$
- Where $n$ is the length of $nums1$ and $m$ is the length of $nums2$
### (2) Two Pointers
```python
class Solution:
    def findMedianSortedArrays(self, nums1, nums2):
        len1, len2 = len(nums1), len(nums2)
        i = j = 0
        median1 = median2 = 0

        for count in range((len1 + len2) // 2 + 1):
            median2 = median1
            if i < len1 and j < len2:
                if nums1[i] > nums2[j]:
                    median1 = nums2[j]
                    j += 1
                else:
                    median1 = nums1[i]
                    i += 1
            elif i < len1:
                median1 = nums1[i]
                i += 1
            else:
                median1 = nums2[j]
                j += 1

        if (len1 + len2) % 2 == 1:
            return float(median1)
        else:
            return (median1 + median2) / 2.0
```
Time Complexity: $O(n+m)$
Space Complexity: $O(1)$
- Where $n$ is the length of $nums1$ and $m$ is the length of $nums2$

### (3) Binary Search
```python
class Solution:
    def get_kth(self, a: List[int], m: int, b: List[int], n: int, k: int, a_start: int = 0, b_start: int = 0) -> int:
        if m > n:
            return self.get_kth(b, n, a, m, k, b_start, a_start)
        if m == 0:
            return b[b_start + k - 1]
        if k == 1:
            return min(a[a_start], b[b_start])
        
        i = min(m, k // 2)
        j = min(n, k // 2)
        
        if a[a_start + i - 1] > b[b_start + j - 1]:
            return self.get_kth(a, m, b, n - j, k - j, a_start, b_start + j)
        else:
            return self.get_kth(a, m - i, b, n, k - i, a_start + i, b_start)
    
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        left = (len(nums1) + len(nums2) + 1) // 2
        right = (len(nums1) + len(nums2) + 2) // 2
        return (self.get_kth(nums1, len(nums1), nums2, len(nums2), left) +
                self.get_kth(nums1, len(nums1), nums2, len(nums2), right)) / 2.0
```
Time Complexity: $O(log(m+n))$
Space Complexity: $O(log(m+n))$
- Where $n$ is the length of $nums1$ and $m$ is the length of $nums2$
### (4) Binary Search (Optimal)
```python
class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        A, B = nums1, nums2
        total = len(nums1) + len(nums2)
        half = total // 2

        if len(B) < len(A):
            A, B = B, A

        l, r = 0, len(A) - 1
        while True:
            i = (l + r) // 2
            j = half - i - 2

            Aleft = A[i] if i >= 0 else float("-infinity")
            Aright = A[i + 1] if (i + 1) < len(A) else float("infinity")
            Bleft = B[j] if j >= 0 else float("-infinity")
            Bright = B[j + 1] if (j + 1) < len(B) else float("infinity")

            if Aleft <= Bright and Bleft <= Aright:
                if total % 2:
                    return min(Aright, Bright)
                return (max(Aleft, Bleft) + min(Aright, Bright)) / 2
            elif Aleft > Bright:
                r = i - 1
            else:
                l = i + 1
```
Time Complexity: $O(log(min(n,m)))$
Space Complexity: $O(1)$
- Where $n$ is the length of $nums1$ and $m$ is the length of $nums2$ 
## References

[^1]: [Median of Two Sorted Arrays - Binary Search - Leetcode 4](https://www.youtube.com/watch?v=q6IEA26hvXc)
[^2]: https://neetcode.io/solutions/median-of-two-sorted-arrays