---
Source:
  - https://leetcode.com/problems/sort-colors/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2023-08-31 at 12.29.59 AM.png]]
	- Library sort functions run on $nlogn$ time
		- [[Merge sort]] and [[quicksort]] have about the same time complexity of $nlogn$ 
	- [[Bucket Sort]] could solve this in linear time
		- Time complexity is $O(n)$ 
			- We can do this since the values are only between 0 and 2
		- For each of the buckets, we're simply going to scan the input array and count how many of each of the values occur in the array
			- Will need extra memory. Will need a [[HashMap (python)|hashmap]] or an [[array]] of size 3
		- We need to build an output array but we are not going to create a separate output array because they want us to do it [[in-place]].
			- We are overriding the memory
			- Not using any extra memory
			- Time complexity: $O(n)$
				- Did need to go through the entire input array twice
					- Once to create buckets
					- Once to build output array
			- And an $O(1)$ solution?
		- Harder solution is the [[one-pass solution]]
			- We can do this in a single pass
- ![[Screenshot 2023-08-31 at 12.38.44 AM.png]]
	- Do you know the portion of [[quicksort]] that requires the [[partition]] algorithm?
		- Do you know how to partition an array?
		- Example of partitioning an array. By placing (1,2) in the left side of the array, by default, (6,7) will be >= 5 and will be placed on the right side of the array
	- Partition
		- Will have a left pointer "L"
		- Will have another pointer "i" which will partition through the array 
		- Will have a right pointer "R"
		- Once "i" pointer passes "R" pointer, then we are done
- Code
```python
class Solution:
    def sortColors(self, nums: List[int]) -> None:
        """
        Do not return anything, modify nums in-place instead.
        """

        l, r=0, len(nums) - 1
        i = 0

        def swap(i, j):
            tmp = nums[i]
            nums[i] = nums[j]
            nums[j] = tmp
        
        while i <= r:
            if nums[i] == 0:
                swap(l, i)
                l += 1
            elif nums[i] == 2:
                swap(i, r)
                r-= 1
                i -= 1
            i += 1
```
- This is the one-pass solution
	- ![[Screenshot 2023-08-31 at 12.59.33 AM.png]]
## References

[^1]: https://www.youtube.com/watch?v=4xbWSRZHqac