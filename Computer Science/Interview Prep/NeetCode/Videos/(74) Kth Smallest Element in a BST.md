---
Source:
  - https://www.youtube.com/watch?v=5LUXSvjmGCw
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
## References

[^1]: https://www.youtube.com/watch?v=5LUXSvjmGCw