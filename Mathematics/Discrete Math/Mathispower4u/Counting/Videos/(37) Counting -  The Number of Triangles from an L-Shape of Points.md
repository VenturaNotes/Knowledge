---
Source:
  - https://www.youtube.com/watch?v=3Nj6ZlU5bOc
Reviewed: false
---
- ![[Screenshot 2025-01-12 at 2.11.04 AM.png]]
	- Permutations and Combinations
		- How many triangles are there with vertices from the points shown below? Note, we are not allowing [[degenerate triangle|degenerate triangles]] - ones with all three vertices on the same line, but we do allow non-right triangles.
		- Grouping the points into 3 groups
			- Corner Point
			- Points above the corner point
			- Points to the right of the corner point
		- First determining non-right triangles
			- 4 choose 1 from vertical group 
			- 5 choose 2 from the horizontal group
			- Then adding
			- 4 choose 2 from the vertical group
			- 5 choose 1 from the horizontal group
			- Then adding all the right triangles (requiring the corner point)