---
Source:
  - https://leetcode.com/problems/detect-squares/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2025-01-03 at 12.04.21 AM.png]]
- Will be given a stream of points
	- #question what is meant by stream?
- O(n) loop only iterating through the diagonal list of points
```python
class CountSquares:

    def __init__(self):
        self.ptsCount = defaultdict(int)
        self.pts = []

    def add(self, point: List[int]) -> None:
        self.ptsCount[tuple(point)] += 1
        self.pts.append(point)

    def count(self, point: List[int]) -> int:
        res = 0
        px, py = point
        for x, y in self.pts:
            if (abs(py - y) != abs(px - x)) or x == px or y == py:
                continue
            res += self.ptsCount[(x, py)] * self.ptsCount[(px, y)]
        return res
        
# Your DetectSquares object will be instantiated and called as such:
# obj = DetectSquares()
# obj.add(point)
# param_2 = obj.count(point)

```
## Source[^2]
### (1) Hash Map - I
```python
class CountSquares:
    def __init__(self):
        self.ptsCount = defaultdict(int)
        self.pts = []

    def add(self, point: List[int]) -> None:
        self.ptsCount[tuple(point)] += 1
        self.pts.append(point)

    def count(self, point: List[int]) -> int:
        res = 0
        px, py = point
        for x, y in self.pts:
            if (abs(py - y) != abs(px - x)) or x == px or y == py:
                continue
            res += self.ptsCount[(x, py)] * self.ptsCount[(px, y)]
        return res
```
Time Complexity: $O(1)$ for $add()$, $O(n)$ for $count()$
Space Complexity: $O(n)$
### (2) Hash Map - II
```python
class CountSquares:

    def __init__(self):
        self.ptsCount = defaultdict(lambda: defaultdict(int))

    def add(self, point: List[int]) -> None:
        self.ptsCount[point[0]][point[1]] += 1

    def count(self, point: List[int]) -> int:
        res = 0
        x1, y1 = point
        for y2 in self.ptsCount[x1]:
            side = y2 - y1
            if side == 0:
                continue

            x3, x4 = x1 + side, x1 - side
            res += (self.ptsCount[x1][y2] * self.ptsCount[x3][y1] *
                    self.ptsCount[x3][y2])

            res += (self.ptsCount[x1][y2] * self.ptsCount[x4][y1] *
                    self.ptsCount[x4][y2])
        return res
```
Time Complexity: $O(1)$ for $add()$, $O(n)$ for $count()$
Space Complexity: $O(n)$
## References

[^1]: [Detect Squares - Leetcode Weekly Contest - Problem 2013 - Python](https://www.youtube.com/watch?v=bahebearrDc)
[^2]: https://neetcode.io/solutions/detect-squares