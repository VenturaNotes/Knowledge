---
Source:
  - https://leetcode.com/problems/subtree-of-another-tree/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-20 at 10.13.08 PM.png|400]]
- Time complexity for this problem is $O(s*t)$
- Most tree problems easiest when understanding them recursively though
- Edge cases
	- If both trees are null, then they would be subtrees of each other
	- A null tree is a subtree of a non-empty tree
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:   
    def isSubtree(self, root: Optional[TreeNode], subRoot: Optional[TreeNode]) -> bool:
        if not subRoot: return True
        if not root: return False

        if self.sameTree(root, subRoot):
            return True
        return (self.isSubtree(root.left, subRoot) or
                self.isSubtree(root.right, subRoot))
        
    def sameTree(self, root, subRoot):
        if not root and not subRoot:
            return True
        if root and subRoot and root.val == subRoot.val:
            return (self.sameTree(root.left, subRoot.left) and
                    self.sameTree(root.right, subRoot.right))
        return False
        
```
## References

[^1]: https://www.youtube.com/watch?v=E36O5SWp-LE