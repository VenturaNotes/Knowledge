---
Source:
  - https://leetcode.com/problems/hand-of-straights/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-30 at 3.19.07 AM.png]]
- Each group but have consecutive cards
- Can be greedy by looking at minimum value first
- Use [[hashmap]] to count number of cards for each value
- Need to make sure that the size of the array is divisible by the GroupSize
- We can use a [[min Heap]] to find minimum value in hashmap
	- Will pop minimum value from our min Heap if the count is decremented down to 
	- Instead of using a [[min heap]], could use a [[TreeMap]]
		- Could search for the minimum value or any particular value in $log(n)$ time and then remove it with a TreeMap
	- However, we can just use a [[min heap]] for this problem because if we have to not pop the minimum value, then this problem will already not be possible
		- As we would be creating a hole in our values
	- Could also just use a sorted input array as well
```python
class Solution:
    def isNStraightHand(self, hand: List[int], groupSize: int) -> bool:
        if len(hand) % groupSize:
            return False
        
        count = {}
        for n in hand:
            count[n] = 1 + count.get(n, 0)
        
        minH = list(count.keys())
        heapq.heapify(minH)
        while minH:
            first = minH[0]

            for i in range(first, first + groupSize):
                if i not in count:
                    return False
                count[i] -= 1
                if count[i] == 0:
                    if i != minH[0]:
                        return False
                    heapq.heappop(minH)
        return True

```
- Using a sorted input array, TreeMap or Heap will all have a time complexity of $O(nlogn)$  
## Source[^2]
### (1) Sorting
```python
class Solution:
    def isNStraightHand(self, hand, groupSize):
        if len(hand) % groupSize:
            return False
        count = Counter(hand)
        hand.sort()
        for num in hand:
            if count[num]:
                for i in range(num, num + groupSize):
                    if not count[i]:
                        return False
                    count[i] -= 1
        return True
```
Time Complexity: $O(nlogn)$
Space Complexity: $O(n)$

### (2) Heap
```python
class Solution:
    def isNStraightHand(self, hand: List[int], groupSize: int) -> bool:
        if len(hand) % groupSize:
            return False

        count = {}
        for n in hand:
            count[n] = 1 + count.get(n, 0)

        minH = list(count.keys())
        heapq.heapify(minH)
        while minH:
            first = minH[0]
            for i in range(first, first + groupSize):
                if i not in count:
                    return False
                count[i] -= 1
                if count[i] == 0:
                    if i != minH[0]:
                        return False
                    heapq.heappop(minH)
        return True
```
Time Complexity: $O(nlogn)$
Space Complexity: $O(n)$
### (3) Ordered Map
```python
class Solution:
    def isNStraightHand(self, hand, groupSize):
        if len(hand) % groupSize != 0:
            return False

        count = Counter(hand)
        q = deque()
        last_num, open_groups = -1, 0

        for num in sorted(count):
            if ((open_groups > 0 and num > last_num + 1) or 
                open_groups > count[num]
            ):
                return False

            q.append(count[num] - open_groups)
            last_num = num
            open_groups = count[num]

            if len(q) == groupSize:
                open_groups -= q.popleft()

        return open_groups == 0
```
Time Complexity: $O(nlogn)$
Space Complexity: $O(n)$

### (4) Hash Map
```python
class Solution:
    def isNStraightHand(self, hand: List[int], groupSize: int) -> bool:
        if len(hand) % groupSize != 0:
            return False
        count = Counter(hand)
        for num in hand:
            start = num
            while count[start - 1]:
                start -= 1
            while start <= num:
                while count[start]:
                    for i in range(start, start + groupSize):
                        if not count[i]:
                            return False
                        count[i] -= 1
                start += 1
        return True
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
## References

[^1]: [Hand of Straights - Leetcode 846 - Python](https://www.youtube.com/watch?v=amnrMCVd2YI)
[^2]: https://neetcode.io/solutions/hand-of-straights