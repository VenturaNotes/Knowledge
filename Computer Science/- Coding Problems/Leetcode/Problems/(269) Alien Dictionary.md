---
Source:
  - https://leetcode.com/problems/alien-dictionary/description/
  - https://thita.ai/problems/alien-dictionary
Approaches: "0"
---
## Synthesis
- Locked on LeetCode
## Source [^1]
- ![[Screenshot 2024-12-01 at 2.20.52 AM.png]]
- [[Topological sort]]
	- Involves a [[directed acyclic graph|DAG]] (a graph which has directed edges but no cycles)
- The input that we're given is already sorted
- In the first example, the order is non-ambiguous
- Could do a BFS or DFS solution for this. (DFS preferred here as BFS requires a lot more bookkeeping) 
- If there is a contradiction, we return an empty string as there would be no real solution (especially if there is a cycle in the graph)
- If we have two separate graphs such as `r -> t -> f` and `w -> e`, then we don't have a contradiction. Just multiple solutions
	- `wertf` or `rtfwe` or `wretf` could all be solutions
- [[post-order DFS]]
	- Helps solve the `A -> B -> C` problem where `A -> C` as well
	- Can build result in reverse order
- ![[Screenshot 2024-12-01 at 2.21.37 AM.png]]
- Will keep track of visit and path
	- Will use dictionary
- Time complexity will be dependent on number of characters
```python
class Solution:
    def foreignDictionary(self, words: List[str]) -> str:
        adj = {c:set() for w in words for c in w}

        for i in range(len(words) - 1):
            w1, w2 = words[i], words[i + 1]
            minLen = min(len(w1), len(w2))
            if len(w1) > len(w2) and w1[:minLen] == w2[:minLen]:
                return ""
            for j in range(minLen):
                if w1[j] != w2[j]:
                    adj[w1[j]].add(w2[j])
                    break
        
        visit = {} # False=visited, True= current path
        res = []

        def dfs(c):
            if c in visit:
                return visit[c]
            
            visit[c] = True

            for nei in adj[c]:
                if dfs(nei):
                    return True

            visit[c] = False
            res.append(c)
        for c in adj:
            if dfs(c):
                return ""
        res.reverse()
        return "".join(res)
```
## Source[^2]
### (1) Depth First Search
```python
class Solution:
    def foreignDictionary(self, words: List[str]) -> str:
        adj = {c: set() for w in words for c in w}

        for i in range(len(words) - 1):
            w1, w2 = words[i], words[i + 1]
            minLen = min(len(w1), len(w2))
            if len(w1) > len(w2) and w1[:minLen] == w2[:minLen]:
                return ""
            for j in range(minLen):
                if w1[j] != w2[j]:
                    adj[w1[j]].add(w2[j])
                    break

        visited = {}
        res = []

        def dfs(char):
            if char in visited:
                return visited[char]

            visited[char] = True

            for neighChar in adj[char]:
                if dfs(neighChar):
                    return True

            visited[char] = False
            res.append(char)

        for char in adj:
            if dfs(char):
                return ""

        res.reverse()
        return "".join(res)
```
Time Complexity: $O(N+V+E)$
Space Complexity: $O(V+E)$
- Where $V$ is the number of unique characters, $E$ is the number of edges and $N$ is the sum of lengths of all the strings
### (2) Topological Sort (Kahn's Algorithm)
```python
class Solution:
    def foreignDictionary(self, words):
        adj = {c: set() for w in words for c in w}
        indegree = {c: 0 for c in adj}
        
        for i in range(len(words) - 1):
            w1, w2 = words[i], words[i + 1]
            minLen = min(len(w1), len(w2))
            if len(w1) > len(w2) and w1[:minLen] == w2[:minLen]:
                return ""
            for j in range(minLen):
                if w1[j] != w2[j]:
                    if w2[j] not in adj[w1[j]]:
                        adj[w1[j]].add(w2[j])
                        indegree[w2[j]] += 1
                    break
        
        q = deque([c for c in indegree if indegree[c] == 0])
        res = []
        
        while q:
            char = q.popleft()
            res.append(char)
            for neighbor in adj[char]:
                indegree[neighbor] -= 1
                if indegree[neighbor] == 0:
                    q.append(neighbor)
        
        if len(res) != len(indegree):
            return ""
        
        return "".join(res)
```
Time Complexity: $O(N+V+E)$
Space Complexity: $O(V+E)$
- Where $V$ is the number of unique characters, $E$ is the number of edges and $N$ is the sum of lengths of all the strings
## References

[^1]: [Alien Dictionary - Topological Sort - Leetcode 269 - Python](https://www.youtube.com/watch?v=6kTZYvNNyps)
[^2]: https://neetcode.io/solutions/alien-dictionary