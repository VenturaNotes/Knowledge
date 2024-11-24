---
Source:
  - https://leetcode.com/problems/course-schedule-ii/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-23 at 11.25.24 PM.png]]
- This is a [[graph]] problem
- Need to return the ordering of courses you should take to finish all courses
- If not possible, return an empty array
	- We know to return an empty array if we have a [[cycle]] in the graph
- [[Topological sort]]
	- This is a standard graphing algorithm
- Starting at every single node, we're going to run [[Depth first search|DFS]] on it.
- First need to build an [[adjacency list]]
- Need to do in order the `4` and `5`
- If we detect cycles, we need to return an empty list as topological sort is not even possible
- Time complexity: O(E + V) or O(P + n)
	- Edges + vertices
	- Prerequisites + courses
- Will use [[HashSet]] to remember current path to detect cycle
```python
class Solution:
    def findOrder(self, numCourses: int, prerequisites: List[List[int]]) -> List[int]:
        # build adjacency list of prereqs
        prereq = { c:[] for c in range(numCourses)}
        for crs, pre in prerequisites:
            prereq[crs].append(pre)

        # a course has 3 possible states:
        # visited -> crs has been added to output
        # visiting -> crs not added to output, but added to cycle
        # unvisited -> crs not added to output or cycle
        output = []
        visit, cycle = set(), set()
        def dfs(crs):
            if crs in cycle:
                return False
            if crs in visit:
                return True
            
            cycle.add(crs)
            for pre in prereq[crs]:
                if dfs(pre) == False:
                    return False
            cycle.remove(crs)
            visit.add(crs)
            output.append(crs)
            return True
        for c in range(numCourses):
            if dfs(c) == False:
                return []
        return output
```
## References

[^1]: https://www.youtube.com/watch?v=Akt3glAwyfY