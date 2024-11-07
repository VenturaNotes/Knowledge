---
Source:
  - https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/
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
## References

[^1]: https://www.youtube.com/watch?v=cQ1Oz4ckceM