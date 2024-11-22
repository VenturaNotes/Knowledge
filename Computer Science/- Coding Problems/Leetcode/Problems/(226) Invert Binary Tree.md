---
Source:
  - https://leetcode.com/problems/invert-binary-tree/
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
## References

[^1]: https://www.youtube.com/watch?v=OnSn2XEQ4MY