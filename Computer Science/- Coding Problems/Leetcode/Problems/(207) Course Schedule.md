---
Source:
  - https://leetcode.com/problems/course-schedule/
Reviewed: false
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
## Source[^2]
### (1) Cycle Detection (DFS)
```python
class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        # Map each course to its prerequisites
        preMap = {i: [] for i in range(numCourses)}
        for crs, pre in prerequisites:
            preMap[crs].append(pre)

        # Store all courses along the current DFS path
        visiting = set()

        def dfs(crs):
            if crs in visiting:
                # Cycle detected
                return False
            if preMap[crs] == []:
                return True

            visiting.add(crs)
            for pre in preMap[crs]:
                if not dfs(pre):
                    return False
            visiting.remove(crs)
            preMap[crs] = []
            return True

        for c in range(numCourses):
            if not dfs(c):
                return False
        return True
```
Time Complexity: $O(V + E)$
Space Complexity: $O(V + E)$
- Where V is the number of courses and E is the number of prerequisites.
### (2) Topological Sort (Kahn's Algorithm)
```python
class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        indegree = [0] * numCourses
        adj = [[] for i in range(numCourses)]
        for src, dst in prerequisites:
            indegree[dst] += 1
            adj[src].append(dst)

        q = deque()
        for n in range(numCourses):
            if indegree[n] == 0:
                q.append(n)
        
        finish = 0
        while q:
            node = q.popleft()
            finish += 1
            for nei in adj[node]:
                indegree[nei] -= 1
                if indegree[nei] == 0:
                    q.append(nei)
                
        return finish == numCourses
```
Time Complexity: $O(V + E)$
Space Complexity: $O(V + E)$
- Where $V$ is the number of courses and $E$ is the number of prerequisites
## References

[^1]: https://www.youtube.com/watch?v=EgI5nU9etnU
[^2]: https://neetcode.io/solutions/course-schedule