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
## References

[^1]: https://www.youtube.com/watch?v=bahebearrDc