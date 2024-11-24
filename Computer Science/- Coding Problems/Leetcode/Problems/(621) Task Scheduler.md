---
Source:
  - https://leetcode.com/problems/task-scheduler/description/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-22 at 9.38.29 PM.png]]
- Limited to characters from uppercase A to uppercase Z (26 characters)
- Something the [[Central Processing Unit|CPU]] needs to process 
- Will use a [[max heap]] for this to continuously figure out which task is the most frequent one
	- Max heap will allow us to determine that in $logn$ time (in fact $log(26)$ since we only have 26 different characters)
		- It is kind of a constant time operation here but will say $O(n)$ since we need to pop and add every value to our max heap
- Time and space complexity is $O(n)$ 
- Will use a [[Queue]] data structure as it may make the problem a little more organized
- Can pop maximum in $log(n)$ time
```python
class Solution:
    def leastInterval(self, tasks: List[str], n: int) -> int:
        # each task 1 unit time
        # minimize idle time

        # O(n*m) due to m idle time for time complexity

        count = Counter(tasks)
        maxHeap = [-cnt for cnt in count.values()]
        heapq.heapify(maxHeap)

        time = 0
        q = deque() # pairs of [-cnt, idleTime]

        while maxHeap or q:
            time += 1

            if maxHeap:
                cnt = 1 + heapq.heappop(maxHeap)
                if cnt:
                    q.append([cnt, time + n])
            
            if q and q[0][1] == time:
                heapq.heappush(maxHeap, q.popleft()[0])
        return time

```
- There is a different solution for this which is more of a a true linear solution $O(n)$, but it is a lot less intuitive and this solution is perfectly fine for interviews.
## References

[^1]: https://www.youtube.com/watch?v=s8p8ukTyA2I