---
Source:
  - https://leetcode.com/problems/sliding-window-maximum/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-16 at 7.07.28 PM.png]]
- `k` will represent the size of sliding window
- Our time complexity will be $O(k*(n-k))$
- Can we make a linear time solution with $n$ as size of input array? Yes
- Given a window of `[1, 2, 3, 4]`, we never need to look at the `2` again. Will never be the maximum if you already checked `[1, 2, 3]` if given window size `k` of 3. Then we just need to check `[3, 4]`
- [[Data structure]] we use to eliminate these values is a [[deque]] (pronounced deck or dee-q)
	- Values in deque will always be in decreasing order
- Adding an removing is an O(1) operation doing that to every single value $O(n)$ which is why it's a good solution
- This problem is known as a [[monotonically decreasing queue]]
	- Queue will always be in decreasing order
	- Using a [[queue]] and not a stack because we want to be able to add and remove elements from the beginning in O(1) time. Want to remove from beginning as well
		- #question I don't think this was explained well. 
```python
class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        output = []
        q = collections.deque()
        l = r = 0
		# Time complexity is O(n) and memory complexity is O(n)
        while r < len(nums):
            # pop smaller values from q
            while q and nums[q[-1]] < nums[r]:
                q.pop()
            q.append(r)

            # remove left val from window
            if l > q[0]:
                q.popleft()

            if (r + 1) >= k:
                output.append(nums[q[0]])
                l += 1
            r += 1
        return output
```
## References

[^1]: https://www.youtube.com/watch?v=DfljaUwZsOk