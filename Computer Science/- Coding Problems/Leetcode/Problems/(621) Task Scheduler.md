---
Source:
  - https://leetcode.com/problems/task-scheduler/description/
Reviewed: false
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
## Source[^2]
### (1) Brute Force
```python
class Solution:
    def leastInterval(self, tasks: List[str], n: int) -> int:
        count = [0] * 26
        for task in tasks:
            count[ord(task) - ord('A')] += 1
        
        arr = []
        for i in range(26):
            if count[i] > 0:
                arr.append([count[i], i])

        time = 0
        processed = []
        while arr:
            maxi = -1
            for i in range(len(arr)):
                if all(processed[j] != arr[i][1] for j in range(max(0, time - n), time)):
                    if maxi == -1 or arr[maxi][0] < arr[i][0]:
                        maxi = i
            
            time += 1
            cur = -1
            if maxi != -1:
                cur = arr[maxi][1]
                arr[maxi][0] -= 1
                if arr[maxi][0] == 0:
                    arr.pop(maxi)
            processed.append(cur)
        return time
```
Time Complexity: $O(t*n)$
Space Complexity: $O(t)$
- Where $t$ is the time to process given tasks and $n$ is the cooldown time
### (2) Max-Heap
```python
class Solution:
    def leastInterval(self, tasks: List[str], n: int) -> int:
        count = Counter(tasks)
        maxHeap = [-cnt for cnt in count.values()]
        heapq.heapify(maxHeap)

        time = 0
        q = deque()  # pairs of [-cnt, idleTime]
        while maxHeap or q:
            time += 1

            if not maxHeap:
                time = q[0][1]
            else:
                cnt = 1 + heapq.heappop(maxHeap)
                if cnt:
                    q.append([cnt, time + n])
            if q and q[0][1] == time:
                heapq.heappush(maxHeap, q.popleft()[0])
        return time
```
Time Complexity: $O(m)$
Space Complexity: $O(1)$ since we have at most 26 different characters.
- Where $m$ is the number of tasks.
### (3) Greedy
```python
class Solution:
    def leastInterval(self, tasks: List[str], n: int) -> int:
        count = [0] * 26
        for task in tasks:
            count[ord(task) - ord('A')] += 1
        
        count.sort()
        maxf = count[25]
        idle = (maxf - 1) * n

        for i in range(24, -1, -1):
            idle -= min(maxf - 1, count[i])
        return max(0, idle) + len(tasks)
```
Time Complexity: $O(m)$
Space Complexity: $O(1)$ since we have at most 26 different characters
- Where $m$ is the number of tasks.
### (4) Math
```python
class Solution:
    def leastInterval(self, tasks: List[str], n: int) -> int:
        count = [0] * 26
        for task in tasks:
            count[ord(task) - ord('A')] += 1
        
        maxf = max(count)
        maxCount = 0
        for i in count:
            maxCount += 1 if i == maxf else 0

        time = (maxf - 1) * (n + 1) + maxCount
        return max(len(tasks), time)
```
Time Complexity: $O(m)$
Space Complexity: $O(1)$ since we have at most 26 different characters
- Where $m$ is the number of tasks
## References

[^1]: https://www.youtube.com/watch?v=s8p8ukTyA2I
[^2]: https://neetcode.io/solutions/task-scheduler