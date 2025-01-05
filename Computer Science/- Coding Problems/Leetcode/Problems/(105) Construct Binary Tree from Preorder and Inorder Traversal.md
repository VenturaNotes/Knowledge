---
Source:
  - https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/
Reviewed: false
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
    def buildTree(self, preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
        if not preorder or not inorder:
            return None

        root = TreeNode(preorder[0])
        mid = inorder.index(preorder[0])
        root.left = self.buildTree(preorder[1 : mid + 1], inorder[:mid])
        root.right = self.buildTree(preorder[mid + 1 :], inorder[mid + 1 :])
        return root
```
Time Complexity: $O(n^2)$
Space Complexity: $O(n^2)$

### (2) Hash Map
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
        indices = {val: idx for idx, val in enumerate(inorder)}
        
        self.pre_idx = 0
        def dfs(l, r):
            if l > r:
                return None

            root_val = preorder[self.pre_idx]
            self.pre_idx += 1
            root = TreeNode(root_val)
            mid = indices[root_val]
            root.left = dfs(l, mid - 1)
            root.right = dfs(mid + 1, r)
            return root

        return dfs(0, len(inorder) - 1)
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
### (3) Depth First Search (Optimal)
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
        preIdx = inIdx = 0
        def dfs(limit):
            nonlocal preIdx, inIdx
            if preIdx >= len(preorder):
                return None
            if inorder[inIdx] == limit:
                inIdx += 1
                return None
            
            root = TreeNode(preorder[preIdx])
            preIdx += 1
            root.left = dfs(root.val)
            root.right = dfs(limit)
            return root
        return dfs(float('inf'))
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
## References

[^1]: https://www.youtube.com/watch?v=ihj4IQGZ2zc
[^2]: https://neetcode.io/solutions/construct-binary-tree-from-preorder-and-inorder-traversal