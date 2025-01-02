---
Source:
  - https://leetcode.com/problems/binary-tree-maximum-path-sum/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-21 at 7.37.25 PM.png]]
- Return the maximum sum path of any path
	- A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them
		- A node can only appear once
		- Path does not need to pass through root
	- The path sum of a path is the sum of the node's values in the path
- In this problem, you can have negative values
- Doing it recursively means we can eliminate repeated work
- Will use [[Depth first search|DFS]] with a linear time solution
- Will keep `res` as global variable but it is possible to solve problem without using this global variable
- Will only look at each node once so Time complexity is O(n) and memory complexity height of tree so O(h) or usually O(logn) if balanced tree
- Will take max of 3 values (left node, right node, 0).
	- This is in case there are negative numbers 
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def maxPathSum(self, root: Optional[TreeNode]) -> int:
        res = [root.val]

        # return max path sum without split
        def dfs(root):
            if not root:
                return 0
            leftMax = dfs(root.left)
            rightMax = dfs(root.right)
            leftMax = max(leftMax, 0)
            rightMax = max(rightMax, 0)

            # compute max path sum WITH split
            res[0] = max(res[0], root.val + leftMax + rightMax)

            return root.val + max(leftMax, rightMax)
        dfs(root)
        return res[0]
```
- To solve it without global variable, pretty much just return two values from function where you have max value with split and max value without split
## References

[^1]: https://www.youtube.com/watch?v=Hr5cWUld4vU