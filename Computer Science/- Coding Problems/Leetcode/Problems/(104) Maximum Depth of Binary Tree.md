---
Source:
  - https://leetcode.com/problems/maximum-depth-of-binary-tree/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-20 at 8.26.23 PM.png|500]]
- There are three different ways to do [[tree traversal|tree traversals]]
	- [[Recursive DFS]]
	- [[Iterative DFS]]
	- Iterative [[Breadth First Search]]
- Longest depth is the number of nodes along the longest path from the root node down to the farthest leaf node. Only given the `root` of binary tree
- This is recursive DFS example
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))
```
- Time complexity is O(n) for BFS
	- BFS on a tree is basically level-ordered traversal
	- Traversing each level by level until we get to the end or last level and we can't continue anymore
	- Counts levels which is the same as max depth
	- BFS typically involves a [[queue]] or a [[Deque]]
		- The queue is going to have the root value
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0
        
        level = 0
        q = deque([root])
        while q:

            for i in range(len(q)):
                node = q.popleft()
                if node.left:
                    q.append(node.left)
                if node.right:
                    q.append(node.right)
            level += 1
        return level
```
- Iterative DFS
	- Will need a [[stack]] data structure because will be emulating the recursive call stack
	- Will implement pre-order DFS rather than in-order DFS
	- Pre-order is by far the easiest to do iteratively
	- Find node with greatest depth
- All these solutions have the same time and space complexity
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        stack = [[root, 1]]
        res = 0

        while stack:
            node, depth = stack.pop()

            if node:
                res = max(res, depth)
                stack.append([node.left, depth + 1])
                stack.append([node.right, depth + 1])
        return res
```
## Source[^2]
### (1) Recursive DFS
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0

        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))
```
Time Complexity: $O(n)$
Space Complexity: $O(h)$
- Best Case([[balanced tree]]): $O(log(n))$
	- [@](https://www.geeksforgeeks.org/balanced-binary-tree/)
- Worst Case ([[degenerate tree]])
	- [@](https://www.geeksforgeeks.org/introduction-to-degenerate-binary-tree/)
- Where $n$ is the number of nodes in the tree and $h$ is the height of the tree

### (2) Iterative DFS (Stack)
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        stack = [[root, 1]]
        res = 0

        while stack:
            node, depth = stack.pop()

            if node:
                res = max(res, depth)
                stack.append([node.left, depth + 1])
                stack.append([node.right, depth + 1])
        return res
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$

### (3) Breadth First Search
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        q = deque()
        if root:
            q.append(root)

        level = 0
        while q:
            for i in range(len(q)):
                node = q.popleft()
                if node.left:
                    q.append(node.left)
                if node.right:
                    q.append(node.right)
            level += 1
        return level
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
## References

[^1]: https://www.youtube.com/watch?v=hTM3phVI6YQ
[^2]: https://neetcode.io/solutions/maximum-depth-of-binary-tree