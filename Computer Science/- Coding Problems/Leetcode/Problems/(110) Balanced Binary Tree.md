---
Source:
  - https://leetcode.com/problems/balanced-binary-tree/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-20 at 8.43.01 PM.png|500]]
- Would have a time complexity of $O(n^2)$ if we needed to check if each node is height-balanced
- Overall time complexity is $O(n)$ if we start from the leaf nodes
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def isBalanced(self, root: Optional[TreeNode]) -> bool:
        def dfs(root):
            if not root: return [True, 0]

            left, right = dfs(root.left), dfs(root.right)
            balanced = (left[0] and right[0] and abs(left[1] - right[1]) <= 1)

            return [balanced, 1 + max(left[1], right[1])]

        return dfs(root)[0]
```
## References

[^1]: https://www.youtube.com/watch?v=QfJsau0ItOY