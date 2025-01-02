---
Source:
  - https://leetcode.com/problems/diameter-of-binary-tree/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-20 at 8.35.48 PM.png]]
- The diameter of a binary tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the root
- The length of a path between two nodes is represented by the number of edges between them
- Will use a [[member variable]] or [[global variable]] for this
- Time complexity is O(n)
- Space complexity is O(log(n)) for a balanced tree or O(n) for a non-balanced tree
	- [[Balanced binary tree]]
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        self.res = 0
        

        # Returns height
        def dfs(curr):
            if not curr:
                return 0
        
            left = dfs(curr.left)
            right = dfs(curr.right)

            self.res = max(self.res, left + right)
            return 1 + max(left, right)

        dfs(root)
        return self.res
```
- There are ways to handle this global case in python instead of using `self.res = 0` 
- There is a [[nonlocal]] keyword in python
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        res = 0

        # Returns height
        def dfs(curr):
            if not curr:
                return 0
        
            left = dfs(curr.left)
            right = dfs(curr.right)
            
            nonlocal res
            res = max(res, left + right)
            return 1 + max(left, right)

        dfs(root)
        return res
```
## References

[^1]: https://www.youtube.com/watch?v=K81C31ytOZE