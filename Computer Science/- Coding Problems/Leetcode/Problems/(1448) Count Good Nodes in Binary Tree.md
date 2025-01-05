---
Source:
  - https://leetcode.com/problems/count-good-nodes-in-binary-tree/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-20 at 10.41.45 PM.png|400]]
- Microsoft's most asked question of 2021 so far
- Time complexity is $O(n)$ 
- Memory complexity is $O(logn)$ or height of tree
	- Could be as big as $O(n)$ 
- Will use preorder [[preorder traversal]] for this
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def goodNodes(self, root: TreeNode) -> int:
        def dfs(node, maxVal):
            if not node:
                return 0
            
            res = 1 if node.val >= maxVal else 0
            maxVal = max(maxVal, node.val)
            res += dfs(node.left, maxVal)
            res += dfs(node.right, maxVal)
            return res
        return dfs(root, root.val)
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
    def goodNodes(self, root: TreeNode) -> int:

        def dfs(node, maxVal):
            if not node:
                return 0

            res = 1 if node.val >= maxVal else 0
            maxVal = max(maxVal, node.val)
            res += dfs(node.left, maxVal)
            res += dfs(node.right, maxVal)
            return res

        return dfs(root, root.val)
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
### (2) Breadth first Search
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def goodNodes(self, root: TreeNode) -> int:
        res = 0
        q = deque()
		
        q.append((root,-float('inf')))

        while q:
            node,maxval = q.popleft()
            if node.val >= maxval:  
                res += 1
				
            if node.left:    
                q.append((node.left,max(maxval,node.val)))
            
            if node.right:
                q.append((node.right,max(maxval,node.val)))
                
        return res
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
## References

[^1]: https://www.youtube.com/watch?v=7cp5imvDzl4
[^2]: https://neetcode.io/solutions/count-good-nodes-in-binary-tree