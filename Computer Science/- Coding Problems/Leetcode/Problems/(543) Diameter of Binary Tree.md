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
## Source[^2]
### (1) Brute Force
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0
        
        leftHeight = self.maxHeight(root.left)
        rightHeight = self.maxHeight(root.right)
        diameter = leftHeight + rightHeight 
        sub = max(self.diameterOfBinaryTree(root.left),
                  self.diameterOfBinaryTree(root.right))
        return max(diameter, sub)


    def maxHeight(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0

        return 1 + max(self.maxHeight(root.left), self.maxHeight(root.right))
```
Time Complexity: $O(n^2)$
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
    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        res = 0

        def dfs(root):
            nonlocal res

            if not root:
                return 0
            left = dfs(root.left)
            right = dfs(root.right)
            res = max(res, left + right)

            return 1 + max(left, right)

        dfs(root)
        return res
```
Time Complexity: $O(n)$
Space Complexity: $O(h)$
- Best case ([[balanced tree]]): $O(log(n))$
- Worst Case ([[degenerate tree]]): $O(n)$
- Where $n$ is the number of nodes in the tree and $h$ is the height of the tree

### (3) Iterative DFS
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        stack = [root]
        mp = {None: (0, 0)}

        while stack:
            node = stack[-1]

            if node.left and node.left not in mp:
                stack.append(node.left)
            elif node.right and node.right not in mp:
                stack.append(node.right)
            else:
                node = stack.pop()

                leftHeight, leftDiameter = mp[node.left]
                rightHeight, rightDiameter = mp[node.right]

                mp[node] = (1 + max(leftHeight, rightHeight),
                           max(leftHeight + rightHeight, leftDiameter, rightDiameter))

        return mp[root][1]
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
## Source[^3]
- 
## References

[^1]: [Diameter of Binary Tree - Leetcode 543 - Python](https://www.youtube.com/watch?v=K81C31ytOZE)
[^2]: https://neetcode.io/solutions/diameter-of-binary-tree
[^3]: [Diameter of a Binary Tree - Leetcode 543 - Python](https://www.youtube.com/watch?v=bkxqA8Rfv04)