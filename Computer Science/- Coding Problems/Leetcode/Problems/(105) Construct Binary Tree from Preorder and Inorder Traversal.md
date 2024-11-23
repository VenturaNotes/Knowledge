---
Source:
  - https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-21 at 7.26.36 PM.png|300]]
- Given two integers `preorder` and `inorder`, construct and return the binary tree
	- [[preorder traversal]]
	- [[inorder traversal]]
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
        if not preorder or not inorder:
            return None
        
        root = TreeNode(preorder[0])
        mid = inorder.index(preorder[0])
        root.left = self.buildTree(preorder[1:mid + 1], inorder[:mid])
        root.right = self.buildTree(preorder[mid + 1:], inorder[mid + 1:])
        return root

```
## References

[^1]: https://www.youtube.com/watch?v=ihj4IQGZ2zc