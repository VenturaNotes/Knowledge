---
Source:
  - https://leetcode.com/problems/serialize-and-deserialize-binary-tree/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-21 at 7.51.23 PM.png]]
- [[Serialization]]
	- The process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment
- Serialize a binary tree to a string and then deserialize it back to the original tree structure.
- Could use BFS for level by level or DFS using preorder traversal (will be shown the second way as it requires a little less code)
- You can use a comma as a [[delimiter]] or even a space if you want
- When you have two nulls, you know you are done with a node
- Time complexity is O(n) for both serializing and deserializing 
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Codec:
    
    # Encodes a tree to a single string.
    def serialize(self, root: Optional[TreeNode]) -> str:
        res = []

        def dfs(node):
            if not node:
                res.append("N")
                return
            res.append(str(node.val))
            dfs(node.left)
            dfs(node.right)
        dfs(root)
        return ",".join(res)

        
    # Decodes your encoded data to tree.
    def deserialize(self, data: str) -> Optional[TreeNode]:
        vals = data.split(",")
        self.i = 0 #This self.i is global

        def dfs():
            if vals[self.i] == "N":
                self.i += 1
                return None
            node = TreeNode(int(vals[self.i]))
            self.i += 1
            node.left = dfs()
            node.right = dfs()
            return node
        return dfs()


```
## References

[^1]: https://www.youtube.com/watch?v=u4JAi2JJhI8