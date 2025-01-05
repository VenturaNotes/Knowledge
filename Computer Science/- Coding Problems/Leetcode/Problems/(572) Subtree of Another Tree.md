---
Source:
  - https://leetcode.com/problems/subtree-of-another-tree/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-20 at 10.13.08 PM.png|400]]
- Time complexity for this problem is $O(s*t)$
- Most tree problems easiest when understanding them recursively though
- Edge cases
	- If both trees are null, then they would be subtrees of each other
	- A null tree is a subtree of a non-empty tree
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:   
    def isSubtree(self, root: Optional[TreeNode], subRoot: Optional[TreeNode]) -> bool:
        if not subRoot: return True
        if not root: return False

        if self.sameTree(root, subRoot):
            return True
        return (self.isSubtree(root.left, subRoot) or
                self.isSubtree(root.right, subRoot))
        
    def sameTree(self, root, subRoot):
        if not root and not subRoot:
            return True
        if root and subRoot and root.val == subRoot.val:
            return (self.sameTree(root.left, subRoot.left) and
                    self.sameTree(root.right, subRoot.right))
        return False
        
```
## Source[^2]
### (1) Depth First Search (DFS)
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    
    def isSubtree(self, root: Optional[TreeNode], subRoot: Optional[TreeNode]) -> bool:
        if not subRoot:
            return True
        if not root:
            return False

        if self.sameTree(root, subRoot):
            return True
        return (self.isSubtree(root.left, subRoot) or 
               self.isSubtree(root.right, subRoot))

    def sameTree(self, root: Optional[TreeNode], subRoot: Optional[TreeNode]) -> bool:
        if not root and not subRoot:
            return True
        if root and subRoot and root.val == subRoot.val:
            return (self.sameTree(root.left, subRoot.left) and 
                   self.sameTree(root.right, subRoot.right))
        return False
```
Time Complexity: $O(m*n)$
Space Complexity: $O(m+n)$
- Where $m$ is the number of nodes in $subRoot$ and $n$ is the number of nodes in $root$
### (2) Serialization and Pattern Matching
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution: 
    def serialize(self, root: Optional[TreeNode]) -> str:
            if root == None:
                return "$#"
            
            return ("$" + str(root.val) + 
                    self.serialize(root.left) + self.serialize(root.right))  

    def z_function(self, s: str) -> list:
        z = [0] * len(s)
        l, r, n = 0, 0, len(s)
        for i in range(1, n):
            if i <= r:
                z[i] = min(r - i + 1, z[i - l])
            while i + z[i] < n and s[z[i]] == s[i + z[i]]:
                z[i] += 1
            if i + z[i] - 1 > r:
                l, r = i, i + z[i] - 1
        return z

    def isSubtree(self, root: Optional[TreeNode], subRoot: Optional[TreeNode]) -> bool:
        serialized_root = self.serialize(root)
        serialized_subRoot = self.serialize(subRoot)
        combined = serialized_subRoot + "|" + serialized_root
        
        z_values = self.z_function(combined)
        sub_len = len(serialized_subRoot)
        
        for i in range(sub_len + 1, len(combined)):
            if z_values[i] == sub_len:
                return True
        return False
```
Time Complexity: $O(m+n)$
Space Complexity: $O(m+n)$
- Where $m$ is the number of nodes in $subRoot$ and $n$ is the number of nodes in $root$ 
## References

[^1]: https://www.youtube.com/watch?v=E36O5SWp-LE
[^2]: https://neetcode.io/solutions/subtree-of-another-tree