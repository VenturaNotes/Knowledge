---
Source:
  - https://leetcode.com/problems/binary-tree-right-side-view/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-20 at 10.35.56 PM.png]]
- Return values of the nodes you can see ordered from top to bottom if you were standing on the right side of the binary tree
- Can solve this with [[Breadth First Search|BFS]]
	- There is a [[Depth first search|DFS]] solution but will focus on the BFS solution
	- BFS in a tree is known as level-order traversal
- Will implement this with a [[queue]] data structure
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def rightSideView(self, root: Optional[TreeNode]) -> List[int]:
        res = []
        q = collections.deque([root])

        while q:
            rightSide = None
            qLen = len(q)

            for i in range(qLen):
                node = q.popleft()
                if node:
                    rightSide = node
                    q.append(node.left)
                    q.append(node.right)
            
            if rightSide:
                res.append(rightSide.val)
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
    def rightSideView(self, root: Optional[TreeNode]) -> List[int]:
        res = []

        def dfs(node, depth):
            if not node:
                return None
            if depth == len(res):
                res.append(node.val)
            
            dfs(node.right, depth + 1)
            dfs(node.left, depth + 1)
        
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
    def rightSideView(self, root: Optional[TreeNode]) -> List[int]:
        res = []

        def dfs(node, depth):
            if not node:
                return None
            if depth == len(res):
                res.append(node.val)
            
            dfs(node.right, depth + 1)
            dfs(node.left, depth + 1)
        
        dfs(root, 0)
        return res
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
## References
[^1]: [Binary Tree Right Side View - Breadth First Search - Leetcode 199](https://www.youtube.com/watch?v=d4zLyf32e3I)
[^2]: https://neetcode.io/solutions/binary-tree-right-side-view