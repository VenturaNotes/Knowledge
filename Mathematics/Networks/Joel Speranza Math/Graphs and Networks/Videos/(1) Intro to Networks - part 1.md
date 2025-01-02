---
Source:
  - https://youtube.com/watch?v=qiJzJwOdNMY
Reviewed: false
---
- ![[Screenshot 2023-01-15 at 12.25.56 PM.png|400]]
	- Network could represent town A with a road leading to town B.
		- Gives you a sense of how you can get from town to town
	- It could also be a friendship group. A and B are friends. A and C are not friends.
		- If A wanted to talk to C, they'd need to go through B.
	- It is a graphical representation of a real world network
		- Call representation a graph (in terms of mathematics)
	- Each point is called a [[vertex]] (Vertex A and Vertex B)
		- Say vertices to talk about multiple vertexes
	- The roads are [[edges]]
		- Graph is made up of vertices and edges
	- [[Degree]]
		- How many edges connect to a vertex
			- "The degree of a vertex "v", represented deg(v), is the number of edges that contain it (loops are counted twice)" [^1]
		- deg(A) = 3
			- The degree of A is equal to 3
			- Just count up the number of edges that connect to the vertex
		- deg(B) = 2
	- [[Loop]]
		- deg(B) = 4 with new loop
			- This is because even though there are only 3 edges connected to B, it's the actual beginning and ending of the edge that we count
			- Loops add degree 2 to any vertex you add them to

## References

[^1]: https://sites.math.northwestern.edu/~mlerma/courses/cs310-05s/notes/dm-graphs