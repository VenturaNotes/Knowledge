---
Source:
  - https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-20 at 10.20.58 PM.png]]
- Root is always going to be a common ancestor of every single node in tree
- Where the split occurs will be the common ancestor
	- In the example, it shows that `p=2` and `q=8`. Since they split from node 6, the lowest common ancestor for both of them would be 6.
	- The edge case where we reach `p` or `q` will be itself the lowest common ancestor
	- [[LCA]] means lowest common ancestor
- Memory complexity will be O(1) and time complexity will be $O(logn)$ 
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def lowestCommonAncestor(self, root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
        cur = root

        while cur:
            if p.val > cur.val and q.val > cur.val:
                cur = cur.right
            elif p.val < cur.val and q.val < cur.val:
                cur = cur.left
            else:
                return cur
```
## Source[^2]
### (1) Recursion
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def lowestCommonAncestor(self, root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
        if not root or not p or not q:
            return None
        if (max(p.val, q.val) < root.val):
            return self.lowestCommonAncestor(root.left, p, q)
        elif (min(p.val, q.val) > root.val):
            return self.lowestCommonAncestor(root.right, p, q)
        else:
            return root
```
Time Complexity: $O(h)$
Space Complexity: $O(h)$
- Where $h$ is the height of three
### (2) Iteration
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def lowestCommonAncestor(self, root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
        cur = root

        while cur:
            if p.val > cur.val and q.val > cur.val:
                cur = cur.right
            elif p.val < cur.val and q.val < cur.val:
                cur = cur.left
            else:
                return cur
```
Time Complexity: $O(h)$
Space Complexity: $O(1)$
- Where $h$ is the height of the tree
## References

[^1]: https://www.youtube.com/watch?v=gs2LMfuOR9k
[^2]: https://neetcode.io/solutions/lowest-common-ancestor-of-a-binary-search-tree