---
Source:
  - https://leetcode.com/problems/sliding-window-maximum/
Reviewed: false
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
## Source[^2]
### (1) Brute Force
```python
class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        output = []

        for i in range(len(nums) - k + 1):
            maxi = nums[i]
            for j in range(i, i + k):
                maxi = max(maxi, nums[j])
            output.append(maxi)

        return output
```
Time Complexity: $O(n*k)$
Space Complexity: $O(1)$
- Where $n$ is the length of the array and $k$ is the size of the window

### (2) Segment Tree
```python
class SegmentTree:
    def __init__(self, N, A):
        self.n = N
        while (self.n & (self.n - 1)) != 0:
            self.n += 1
        self.build(N, A)

    def build(self, N, A):
        self.tree = [float('-inf')] * (2 * self.n)
        for i in range(N):
            self.tree[self.n + i] = A[i]
        for i in range(self.n - 1, 0, -1):
            self.tree[i] = max(self.tree[i << 1], self.tree[i << 1 | 1])

    def query(self, l, r):
        res = float('-inf')
        l += self.n
        r += self.n + 1
        while l < r:
            if l & 1:
                res = max(res, self.tree[l])
                l += 1
            if r & 1:
                r -= 1
                res = max(res, self.tree[r])
            l >>= 1
            r >>= 1
        return res


class Solution:
    def maxSlidingWindow(self, nums, k):
        n = len(nums)
        segTree = SegmentTree(n, nums)
        output = []
        for i in range(n - k + 1):
            output.append(segTree.query(i, i + k - 1))
        return output
```
Time Complexity: $O(nlogn)$
Space Complexity: $O(n)$

### (3) Heap
```python
class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        heap = []
        output = []
        for i in range(len(nums)):
            heapq.heappush(heap, (-nums[i], i))
            if i >= k - 1:
                while heap[0][1] <= i - k:
                    heapq.heappop(heap)
                output.append(-heap[0][0])
        return output
```
Time Complexity: $O(nlogn)$
Space Complexity: $O(n)$

### (4) Dynamic Programming
```python
class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        n = len(nums)
        leftMax = [0] * n
        rightMax = [0] * n

        leftMax[0] = nums[0]
        rightMax[n - 1] = nums[n - 1]

        for i in range(1, n):
            if i % k == 0:
                leftMax[i] = nums[i]
            else:
                leftMax[i] = max(leftMax[i - 1], nums[i])

            if (n - 1 - i) % k == 0:
                rightMax[n - 1 - i] = nums[n - 1 - i]
            else:
                rightMax[n - 1 - i] = max(rightMax[n - i], nums[n - 1 - i])

        output = [0] * (n - k + 1)

        for i in range(n - k + 1):
            output[i] = max(leftMax[i + k - 1], rightMax[i])

        return output
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
### (5) Deque
```python
class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        output = []
        q = deque()  # index
        l = r = 0

        while r < len(nums):
            while q and nums[q[-1]] < nums[r]:
                q.pop()
            q.append(r)

            if l > q[0]:
                q.popleft()

            if (r + 1) >= k:
                output.append(nums[q[0]])
                l += 1
            r += 1

        return output
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
## References

[^1]: https://www.youtube.com/watch?v=DfljaUwZsOk
[^2]: https://neetcode.io/solutions/sliding-window-maximum