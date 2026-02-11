---
Source:
  - https://leetcode.com/problems/validate-binary-search-tree/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-20 at 10.47.58 PM.png]]
- Given the root of a binary tree, we just need to determine if it is a [[valid binary search tree]]
- A valid BST is defined as follows
	- Left subtree of a node contains only nodes with keys less than the node's key
	- Right subtree of a node contains only nodes with keys greater than the node's key
	- Both the left and right subtrees must also be binary search trees
- Need to do a recursive DFS for this problem
- Brute force would be $O(n^2)$ 
- Just need to update boundaries
- The time complexity is 2n or rather $O(n)$ which is still linear
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        def valid(node, left, right):
            if not node:
                return True
            
            if not (node.val < right and node.val > left):
                return False
            
            return (valid(node.left, left, node.val) and
            valid(node.right, node.val, right))
        return valid(root, float("-inf"), float("inf"))
        
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
    left_check = staticmethod(lambda val, limit: val < limit) 
    right_check = staticmethod(lambda val, limit: val > limit) 

    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        if not root:
            return True
        
        if (not self.isValid(root.left, root.val, self.left_check) or
            not self.isValid(root.right, root.val, self.right_check)):
            return False
        
        return self.isValidBST(root.left) and self.isValidBST(root.right)

    def isValid(self, root: Optional[TreeNode], limit: int, check) -> bool:
        if not root:
            return True
        if not check(root.val, limit):
            return False
        return (self.isValid(root.left, limit, check) and
                self.isValid(root.right, limit, check))
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
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        def valid(node, left, right):
            if not node:
                return True
            if not (left < node.val < right):
                return False

            return valid(node.left, left, node.val) and valid(
                node.right, node.val, right
            )

        return valid(root, float("-inf"), float("inf"))
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
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        if not root:
            return True

        q = deque([(root, float("-inf"), float("inf"))])

        while q:
            node, left, right = q.popleft()
            if not (left < node.val < right):
                return False
            if node.left:
                q.append((node.left, left, node.val))
            if node.right:
                q.append((node.right, node.val, right))

        return True
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
## References

[^1]: [Validate Binary Search Tree - Depth First Search - Leetcode 98](https://www.youtube.com/watch?v=s6ATEkipzow)
[^2]: https://neetcode.io/solutions/validate-binary-search-tree