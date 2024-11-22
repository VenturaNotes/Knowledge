---
Source:
  - https://leetcode.com/problems/validate-binary-search-tree/
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
## References

[^1]: https://www.youtube.com/watch?v=s6ATEkipzow