---
Source:
  - https://youtube.com/watch?v=osK_wmOJ1lA
Reviewed: false
---
- ![[Screenshot 2023-01-15 at 2.21.30 PM.png|200]]
- To create a tree, we need to join up A, B, C, and D in the subgraph we've chosen
	- Rules
		- No Loops
		- No Multiple Edges
		- No Cycles
			- A - C - D - A is a cycle
		- Can only use the connections that already exist
- [[Tree]]
	- A connection of vertices using as few edges as possible
	- A connected graph with v-1 edges
		- This is different from how the [[(4) Networks Relationship between Sum of degree of Vertices and Edges|degree of a network will always be double the # of edges]]
		- It has 3 edges
- [[Spanning Tree]]
	- A tree using all vertices
	- ![[Screenshot 2023-01-15 at 2.19.28 PM.png]]
		- It's a connected graph
		- There are only 4 edges because there are 5 vertices
	- It's called a spanning tree because you can draw it to make it look like a tree
		- ![[Screenshot 2023-01-15 at 2.20.18 PM.png]]
	- It's possible to draw different spanning trees of the same graph
		- ![[Screenshot 2023-01-15 at 2.20.50 PM.png]]
- There are minimum spanning trees as well