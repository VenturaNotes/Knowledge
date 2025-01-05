---
Source:
  - https://leetcode.com/problems/koko-eating-bananas/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-10-18 at 7.40.28 PM.png]]
- Brute force solution can easily become a binary search solution (which is the optimal solution for the problem)
- They guarantee us that `h` will be greater than or equal to the number of piles
- Minimum for this problem
- We want to know the minimum eating speed of Koko that she can eat all of the piles in exactly 5 hours
- Must eat all the piles in at most 8 hours or less (for one example problem)
- The improved time complexity is $O(log(max(p))*p)$
```python
class Solution:
    def minEatingSpeed(self, piles: List[int], h: int) -> int:
        l, r = 1, max(piles)
        res = r

        while l <= r:
            k = (l + r) // 2
            hours = 0
            for p in piles:
                hours += math.ceil(p / k)
            if hours <= h:
                res = min(res, k)
                r = k - 1
            else:
                l = k + 1
        return res
```
## Source[^2]
### (1) Brute Force
```python
class Solution:
    def minEatingSpeed(self, piles: List[int], h: int) -> int:
        speed = 1
        while True:
            totalTime = 0
            for pile in piles:
                totalTime += math.ceil(pile / speed)
            
            if totalTime <= h:
                return speed
            speed += 1
        return speed
```
Time Complexity: $O(m*n)$
Space Complexity: $O(1)$
- Where $n$ is the length of the input array `piles` and $m$ is the maximum number of bananas in a pile

### (2) Binary Search
```python
class Solution:
    def minEatingSpeed(self, piles: List[int], h: int) -> int:
        l, r = 1, max(piles)
        res = r

        while l <= r:
            k = (l + r) // 2

            totalTime = 0
            for p in piles:
                totalTime += math.ceil(float(p) / k)
            if totalTime <= h:
                res = k
                r = k - 1
            else:
                l = k + 1
        return res
```
Time Complexity: $O(n*logm)$
Space Complexity: $O(1)$
- Where $n$ is the length of the input array `piles` and `m` is the maximum number of bananas in a pile
## References

[^1]: https://www.youtube.com/watch?v=U2SozAs9RzA
[^2]: https://neetcode.io/solutions/koko-eating-bananas