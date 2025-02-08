---
Source:
  - https://www.youtube.com/watch?v=Di6ifCW9sS0
Reviewed: false
---
- ![[Screenshot 2025-02-08 at 9.51.09 AM.png]]
	- Graph Theory: Trees
		- For each [[degree sequence]] below, decide whether it must always, must never, or could possibly be a degree sequence for a tree. Justify your answers
			- A [[graph]] is an ordered pair G = (V, E) consisting of a nonempty set V (called the vertices) and a set E (called the edges) of two-element subsets of V
			- A [[tree]] is a connected graph containing no cycles (acyclic). For any tree: $v = e + 1$ or $e = v - 1$ 
			- A graph is connected if you can get from any vertex to any other vertex by following some path of edges
			- A [[cycle]] is a path that starts and stops at the same vertex
			- [[Handshake lemma]] (degree sum formula). In any graph, the sum of the degrees of vertices in the graph is always twice the number of edges
		- Will be using definition of a [[simple graph]] meaning no two vertices can be connected by more than one edge. And no edge can be connected to more than one vertex
			- Not considering multigraphs in this exercise
	- Problems
		- (a) Could never be a tree because $v = e + 1$ does not work
		- (b) Could be a tree or not a tree because possible to create a disconnected graph as well as a cycle 
		- (c) Similar to (a)
		- (d) degree sequence always a tree
