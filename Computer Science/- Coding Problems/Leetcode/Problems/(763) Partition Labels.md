---
Source:
  - https://leetcode.com/problems/partition-labels/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-30 at 4.08.00 AM.png]]
- Partitions need to be [[contiguous]]
- We care about the last "a" character the most
- [[Hashmap]]
	- Take unique character and take last index that it occurs at.
	- Will have constant memory complexity O(26)
- Did two passes
	- One to build hashmap
	- Another to build output
- Time complexity is just $O(n)$ 
- Memory complexity is $O(1)$ as hashmap is limited to 26 characters
```python
class Solution:
    def partitionLabels(self, s: str) -> List[int]:
        lastIndex = {} # char -> last index in s

        for i, c in enumerate(s):
            lastIndex[c] = i

        res = []
        size, end = 0, 0
        for i, c in enumerate(s):
            size += 1
            end = max(end, lastIndex[c])

            if i == end:
                res.append(size)
                size = 0
        return res
```
## References

[^1]: https://www.youtube.com/watch?v=B7m8UmZE-vw