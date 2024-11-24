---
Source:
  - https://leetcode.com/problems/course-schedule/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-23 at 11.12.49 PM.png]]
- The pair `[0, 1]` can be expressed as an edge
- Going to show how to solve problem with DFS but can also use BFS
- Can use as [[adjacency list]] which is a data structure
	- Will call it a prerequisite map because we will use a HashMap to represent this
- Time complexity is $O(n + p)$ 
	- We have to visit every single node and we have to move along every single edge
	- Don't have to revisit a course twice. Once we know it can be completed, we can know it
- Last data structure we will use is a [[set]]
	- If a node is detected in the visitSet, then we know the courses can not be completed as it creates a loop.
```python
class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        # map each course to prereq list
        preMap = {i:[] for i in range(numCourses)}
        for crs, pre in prerequisites:
            preMap[crs].append(pre)
        
        # visitSet = all courses along the curr DFS path
        visitSet = set()
        def dfs(crs):
            if crs in visitSet:
                return False
            if preMap[crs] == []:
                return True
            
            visitSet.add(crs)
            for pre in preMap[crs]:
                if not dfs(pre): return False
            visitSet.remove(crs)
            preMap[crs] = []
            return True
        
        for crs in range(numCourses):
            if not dfs(crs): return False
        return True
```
- Manually check two separate graphs if not connected which is the why the last for loop exists
## References

[^1]: https://www.youtube.com/watch?v=EgI5nU9etnU