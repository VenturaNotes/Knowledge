---
Source:
  - https://youtube.com/watch?v=2ZgfZgmC9rA
Reviewed: false
---
- ![[Screenshot 2023-06-13 at 9.53.43 PM.png]]
	- [[Trail]]: A sequence of vertices in G
		- Some texts define a trail as a sequence of vertices, but between each pair of vertices in the sequence they also put the edge that joins those vertices
			- Consecutive vertices are adjacent in G
			- <mark style="background: #FFF3A3A6;">You can't traverse the same edge multiple times in a trail</mark>
				- You can traverse the same vertex multiple times in a trail
			- [[Open trail]] since first and last vertices are distinct
				- Can refer to the first and last vertices as [[endpoint|endpoints]]
				- If edge points are equal, it would be a closed trail 
			- [[Length of trail]]: number of edges encountered during the trail
				- Length 6 in this case for trail T
					- This is 1 less than the number of vertices encountered in a trail which is a rule that holds true for trails and walks
			- This is a $V_1 - V_3$ trail
				- We can also say that every vertex and edge in the trail lies on that trail
