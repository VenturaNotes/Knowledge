---
Source:
  - https://leetcode.com/problems/kth-smallest-element-in-a-bst/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-21 at 7.18.18 PM.png|400]]
- Given the `root` of a binary search tree, and an integer `k`, return the $k^{th}$ (1-indexed) smallest element in the tree.
- A [[binary search tree]] by definition means that it's in order.
- Writing an inorder traversal for a binary search tree recursively is pretty easy
	- We will be shown how to do it iteratively though
- Need a [[stack]] to contain the previous nodes that we need to pop back up to 
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        n = 0
        stack = []
        cur = root

        while cur or stack:
            while cur:
                stack.append(cur)
                cur = cur.left
            
            cur = stack.pop()
            n += 1
            if n == k:
                return cur.val
            cur = cur.right


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
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        arr = []

        def dfs(node):
            if not node:
                return
            
            arr.append(node.val)
            dfs(node.left)
            dfs(node.right)
        
        dfs(root)
        arr.sort()
        return arr[k - 1]
```
Time Complexity: $O(nlogn)$
Space Complexity: $O(n)$

### (2) Inorder Traversal
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        arr = []

        def dfs(node):
            if not node:
                return
            
            dfs(node.left)
            arr.append(node.val)
            dfs(node.right)
        
        dfs(root)
        return arr[k - 1]
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$

### (3) Recursive DFS (Optimal)
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        cnt = k
        res = root.val

        def dfs(node):
            nonlocal cnt, res
            if not node:
                return
            
            dfs(node.left)
            cnt -= 1
            if cnt == 0:
                res = node.val
                return
            dfs(node.right)
        
        dfs(root)
        return res
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
### (4) Iterative DFS (Optimal)
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        stack = []
        curr = root

        while stack or curr:
            while curr:
                stack.append(curr)
                curr = curr.left
            curr = stack.pop()
            k -= 1
            if k == 0:
                return curr.val
            curr = curr.right
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$

### (5) Morris Travel
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        curr = root
        
        while curr:
            if not curr.left:
                k -= 1
                if k == 0:
                    return curr.val
                curr = curr.right
            else:
                pred = curr.left
                while pred.right and pred.right != curr:
                    pred = pred.right
                
                if not pred.right:
                    pred.right = curr
                    curr = curr.left
                else:
                    pred.right = None
                    k -= 1
                    if k == 0:
                        return curr.val
                    curr = curr.right

        return -1
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$
## References

[^1]: https://www.youtube.com/watch?v=5LUXSvjmGCw
[^2]: https://neetcode.io/problems/kth-smallest-integer-in-bst