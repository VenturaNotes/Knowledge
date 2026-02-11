---
Source:
  - https://leetcode.com/problems/invert-binary-tree/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-20 at 8.08.02 PM.png|300]]
- Invert a [[binary tree]]
	- It means to visit every single node in the tree and every time we visit a node, take a look at its two children and swap the positions of the children
	- If given a tree, look at the root node and take its children, swap the positions, and then recursively run invert tree on left and right sub-trees
- Can do a [[depth first search]] whether its pre-order or post-order (it doesn't matter for this problem)
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        if not root:
            return None

        # swap the children
        tmp = root.left
        root.left = root.right
        root.right = tmp

        self.invertTree(root.left)
        self.invertTree(root.right)
        return root
```
- Fun trivia:
	- [[Max Howell]] wrote the software called [[Homebrew]] but was not able to invert a binary tree on a whiteboard during a Google interview. 
## Source[^2]
### (1) Breadth First Search
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        if not root:
            return None
        queue = deque([root])
        while queue:
            node = queue.popleft()
            node.left, node.right = node.right, node.left
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        return root
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
### (2) Depth First Search
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        if not root: return None

        root.left, root.right = root.right, root.left
        
        self.invertTree(root.left)
        self.invertTree(root.right)
        
        return root
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$

### (3) Depth First Search (Stack)
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        if not root:
            return None
        stack = [root]
        while stack:
            node = stack.pop()
            node.left, node.right = node.right, node.left
            if node.left:
                stack.append(node.left)
            if node.right:
                stack.append(node.right)
        return root
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
## References

[^1]: [Invert Binary Tree - Depth First Search - Leetcode 226](https://www.youtube.com/watch?v=OnSn2XEQ4MY)
[^2]: https://neetcode.io/problems/invert-a-binary-tree