---
Source:
  - https://leetcode.com/problems/same-tree/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-20 at 9.56.22 PM.png|400]]
- Structure and same value should be checked
- Lends itself well to recursion
- Time complexity is O(p + q)
	- Worst case, we have to iterate through every single node in both trees
- Will do DFS here
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
        if not p and not q:
            return True
        if not p or not q or p.val != q.val:
            return False
        
        return (self.isSameTree(p.left, q.left) and self.isSameTree(p.right, q.right))
```
## References

[^1]: https://www.youtube.com/watch?v=vRbbcKXCxOw