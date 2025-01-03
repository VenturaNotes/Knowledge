---
Source:
  - https://youtube.com/watch?v=ZQY4IfEcGvM
Reviewed: false
---
- ![[Screenshot 2023-06-13 at 1.12.19 AM.png]]
	- [[Graph]] is called G
		- Made of vertices and edges (which connect pairs of vertices)
		- [[Simple Graph]]
			- Not allowed
				- Loop (edge from one vertex to itself)
				- Multiple edges joining the same pair of vertices 
				- Edges don't have direction
	- Simple graphs are usually just called graphs
	- A graph called G is an [[ordered pair]] with some vertex set (V) and some edge set (E)
		- G = (V, E)
		- Vertex set must come first and then the edge set second
		- We can kind of write the graph explicitly without labels. 
	- Edge set is comprised of two element subsets of the vertex set. The two elements that go into each subset are vertices that are joined by an edge
		- Order of vertices in edge set does not matter
	- Example shown is a [[complete graph]] because every pair of vertices is joined by an edge.
- ![[Screenshot 2023-06-13 at 1.19.13 AM.png]]
	- A graph is an ordered pair with a vertex and an edge set.
	- G and H are the same graphs
		- You can draw any graph in an infinite number of ways, but what's important is the edges and vertices that it has.
			- Graphs are equal if they have the same [[Vertex Set|Vertex Set]] and [[Edge Set|Edge Set]]
- ![[Screenshot 2023-06-13 at 1.21.47 AM.png]]
	- [[Empty Graph]]
		- Any graph that has an empty edge set. It's an ordered pair with some vertex set and an empty edge set.
			- Vertices with no edges
	- G = ({}, {}) is sometimes and sometimes not considered a graph
		- If it's considered a graph, it's known as the [[Null Graph|null graph]]
			- Empty graph with 0 vertices
- ![[Screenshot 2023-06-13 at 1.23.40 AM.png]]
	- How a graph can represent objects and how the objects are related.
		- Objects
			- name of the party-goers
			- Vertices represent the objects of a situation
		- Relations
			- On right side (pairs of people who have shaken hands)