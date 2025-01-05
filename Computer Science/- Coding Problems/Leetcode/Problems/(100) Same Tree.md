---
Source:
  - https://leetcode.com/problems/same-tree/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-20 at 9.56.22 PM.png|400]]
- Structure and same value should be checked
- Lends itself well to recursion
- Time complexity is O(p + q)
	- Worst case, we have to iterate through every single node in both trees
- Will do DFS here
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
        if not p and not q:
            return True
        if not p or not q or p.val != q.val:
            return False
        
        return (self.isSameTree(p.left, q.left) and self.isSameTree(p.right, q.right))
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
    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
        if not p and not q:
            return True
        if p and q and p.val == q.val:
            return self.isSameTree(p.left, q.left) and self.isSameTree(p.right, q.right)
        else:
            return False
```
Time Complexity: $O(n)$
Space Complexity: $O(h)$
- Best case ([[balanced tree]]): $O(log(n))$
- Worst Case([[degenerate tree]]): $O(n)$
- Where $n$ is the number of nodes in the tree and $h$ is the height of the tree
### (2) Breadth First Search
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
        q1 = deque([p])
        q2 = deque([q])

        while q1 and q2:
            nodeP = q1.popleft()
            nodeQ = q2.popleft()

            if nodeP is None and nodeQ is None:
                continue
            if nodeP is None or nodeQ is None or nodeP.val != nodeQ.val:
                return False

            q1.append(nodeP.left)
            q1.append(nodeP.right)
            q2.append(nodeQ.left)
            q2.append(nodeQ.right)

        return True
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$

## References

[^1]: https://www.youtube.com/watch?v=vRbbcKXCxOw
[^2]: https://neetcode.io/solutions/same-tree