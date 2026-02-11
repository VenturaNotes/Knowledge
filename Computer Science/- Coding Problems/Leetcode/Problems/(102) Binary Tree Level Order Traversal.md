---
Source:
  - https://leetcode.com/problems/binary-tree-level-order-traversal/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-20 at 10.27.27 PM.png]]
- To traverse a tree in level order, use [[Breadth First Search|BFS]]
- Will use a queue for this
- Time and memory complexity is O(n)
	- A queue could have up to $\frac n2$ elements in it because the biggest level would be $\frac n2$. That is how binary trees work at least.
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        res = []

        q = collections.deque()
        q.append(root)

        while q:
            qLen = len(q)
            level = []
            for i in range(qLen):
                node = q.popleft()
                if node:
                    level.append(node.val)
                    q.append(node.left)
                    q.append(node.right)
            if level:
                res.append(level)
        return res
```
## Source[^2]
### (1) Depth First Search
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        res = []

        def dfs(node, depth):
            if not node:
                return None
            if len(res) == depth:
                res.append([])
            
            res[depth].append(node.val)
            dfs(node.left, depth + 1)
            dfs(node.right, depth + 1)
        
        dfs(root, 0)
        return res
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
### (2) Breadth First Search
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        res = []

        def dfs(node, depth):
            if not node:
                return None
            if len(res) == depth:
                res.append([])
            
            res[depth].append(node.val)
            dfs(node.left, depth + 1)
            dfs(node.right, depth + 1)
        
        dfs(root, 0)
        return res
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
## References

[^1]: [Binary Tree Level Order Traversal - BFS - Leetcode 102](https://www.youtube.com/watch?v=6ZnyEApgFYg)
[^2]: https://neetcode.io/solutions/binary-tree-level-order-traversal