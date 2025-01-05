---
Source:
  - https://leetcode.com/problems/minimum-interval-to-include-each-query/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-30 at 2.38.12 AM.png]]
- Find length of smallest interval that the query falls into
- $O(n*q)$
	- This will be the overall time complexity
	- `n` is the size of intervals
	- `q` is the size of queries
- More efficient time complexity
	- $O(nlogn + qlogq)$ 
		- Will sort intervals and queries
		- Then can scan queries from left to right
- Will need a [[min Heap]] to find the smallest interval for this
- Will make sure start time is less than or equal to query
```python
class Solution:
    def minInterval(self, intervals: List[List[int]], queries: List[int]) -> List[int]:
        intervals.sort()
        minHeap = []
        res, i = {}, 0

        for q in sorted(queries):
            while i < len(intervals) and intervals[i][0] <= q:
                l, r = intervals[i]
                heapq.heappush(minHeap, (r - l + 1, r))
                i += 1
            while minHeap and minHeap[0][1] < q:
                heapq.heappop(minHeap)
            res[q] = minHeap[0][0] if minHeap else -1
        return [res[q] for q in queries]
```
- Time Complexity: $O(nlogn + qlogq)$ 
	- `n` is length of intervals
	- `q` is length of queries
	
## Source[^2]
### (1) Brute Force
```python
class Solution:
    def minInterval(self, intervals: List[List[int]], queries: List[int]) -> List[int]:
        n = len(intervals)
        res = []
        for q in queries:
            cur = -1
            for l, r in intervals:
                if l <= q <= r:
                    if cur == -1 or (r - l + 1) < cur:
                        cur = r - l + 1
            res.append(cur)
        return res
```
Time Complexity: $O(m*n)$
Space Complexity: $O(1)$
- Where $m$ is the length of the array $queries$ and $n$ is the length of the array $intervals$
### (2) Sweep Line Algorithm
```python
class Solution:
    def minInterval(self, intervals: List[List[int]], queries: List[int]) -> List[int]:
        events = []
        # Create events for intervals
        for idx, (start, end) in enumerate(intervals):
            events.append((start, 0, end - start + 1, idx))    
            events.append((end, 2, end - start + 1, idx))      
        
        # Create events for queries
        for i, q in enumerate(queries):
            events.append((q, 1, i))
        
        # Sort by time and type (end before query)
        events.sort(key=lambda x: (x[0], x[1]))
        
        # Min heap storing [size, index]
        sizes = []  
        ans = [-1] * len(queries)
        inactive = [False] * len(intervals)
        
        for time, type, *rest in events:
            if type == 0:  # Interval start
                interval_size, idx = rest
                heapq.heappush(sizes, (interval_size, idx))
            elif type == 2: #Interval end
                idx = rest[1]
                inactive[idx] = True
            else: # Query
                query_idx = rest[0]
                while sizes and inactive[sizes[0][1]]:
                    heapq.heappop(sizes)
                if sizes:
                    ans[query_idx] = sizes[0][0]
        
        return ans
```
Time Complexity: $O((n+m)log(n+m))$
Space Complexity: $O(n+m)$
- Where $m$ is the length of the array $queries$ and $n$ is the length of the array $intervals.$
### (3) Min Heap
```python
class Solution:
    def minInterval(self, intervals: List[List[int]], queries: List[int]) -> List[int]:
        intervals.sort()
        minHeap = []
        res = {}
        i = 0
        for q in sorted(queries):
            while i < len(intervals) and intervals[i][0] <= q:
                l, r = intervals[i]
                heapq.heappush(minHeap, (r - l + 1, r))
                i += 1

            while minHeap and minHeap[0][1] < q:
                heapq.heappop(minHeap)
            res[q] = minHeap[0][0] if minHeap else -1
        return [res[q] for q in queries]
```
Time Complexity: $O(nlogn + mlogm)$
Space Complexity: $O(n+m)$
- Where $m$ is the length of the array $queries$ and $n$ is the length of the array $intervals$
### (4) Min Segment Tree (Lazy Propagation)
```python
class SegmentTree:
    def __init__(self, N):
        self.n = N
        self.tree = [float('inf')] * (4 * N)
        self.lazy = [float('inf')] * (4 * N)

    def propagate(self, treeidx, lo, hi):
        if self.lazy[treeidx] != float('inf'):
            self.tree[treeidx] = min(self.tree[treeidx], self.lazy[treeidx])
            if lo != hi:
                self.lazy[2 * treeidx + 1] = min(self.lazy[2 * treeidx + 1], self.lazy[treeidx])
                self.lazy[2 * treeidx + 2] = min(self.lazy[2 * treeidx + 2], self.lazy[treeidx])
            self.lazy[treeidx] = float('inf')

    def update(self, treeidx, lo, hi, left, right, val):
        self.propagate(treeidx, lo, hi)
        if lo > right or hi < left:
            return
        if lo >= left and hi <= right:
            self.lazy[treeidx] = min(self.lazy[treeidx], val)
            self.propagate(treeidx, lo, hi)
            return
        mid = (lo + hi) // 2
        self.update(2 * treeidx + 1, lo, mid, left, right, val)
        self.update(2 * treeidx + 2, mid + 1, hi, left, right, val)
        self.tree[treeidx] = min(self.tree[2 * treeidx + 1], self.tree[2 * treeidx + 2])

    def query(self, treeidx, lo, hi, idx):
        self.propagate(treeidx, lo, hi)
        if lo == hi:
            return self.tree[treeidx]
        mid = (lo + hi) // 2
        if idx <= mid:
            return self.query(2 * treeidx + 1, lo, mid, idx)
        else:
            return self.query(2 * treeidx + 2, mid + 1, hi, idx)

    def update_range(self, left, right, val):
        self.update(0, 0, self.n - 1, left, right, val)

    def query_point(self, idx):
        return self.query(0, 0, self.n - 1, idx)

class Solution:
    def minInterval(self, intervals: List[List[int]], queries: List[int]) -> List[int]:
        points = []
        for interval in intervals:
            points.append(interval[0])
            points.append(interval[1])
        for q in queries:
            points.append(q)

        # Compress the coordinates
        points = sorted(set(points))
        compress = {points[i]: i for i in range(len(points))}

        # Lazy Segment Tree
        segTree = SegmentTree(len(points))

        for interval in intervals:
            start = compress[interval[0]]
            end = compress[interval[1]]
            length = interval[1] - interval[0] + 1
            segTree.update_range(start, end, length)

        ans = []
        for q in queries:
            idx = compress[q]
            
            # query for minSize
            res = segTree.query_point(idx)
            ans.append(res if res != float('inf') else -1)
        return ans
```
Time Complexity: $O((n+m)logk)$
Space Complexity: $O(k)$
- Where $m$ is the length of the array $queries$, $n$ is the length of the array $intervals$ and $k$ is the number of unique points.
## References

[^1]: https://www.youtube.com/watch?v=5hQ5WWW5awQ
[^2]: https://neetcode.io/solutions/minimum-interval-to-include-each-query