---
Source:
  - https://www.youtube.com/watch?v=lWfR2g5tkik
Reviewed: false
---
- ![[Screenshot 2025-02-06 at 7.45.27 AM.png]]
	- [[Bipartite Graphs]] and Named Graphs
		- A graph is bipartite if the vertices can be divided into two sets, A and B, with no two vertices in A adjacent and no two vertices in B adjacent. The vertices in A can be adjacent to some or all of the vertices in B. Every edge connects a vertex in A and B
		- If each vertex in A is adjacent to all the vertices in B, then the graph is a [[complete bipartite graph]], and gets a special name: $K_{m, n}$, where |A| = m and |B| = n. The graph in the houses and utilities puzzle (Example 4.0.2) is $K_{3,3}$
			- $K_{m,n}$ can be read as "k sub m comma n" or just "k m n"
		- Some graphs are used more than others and get special names. Let's look at some named graphs
	- Bipartite Graphs and Named Graphs
		- Named Graphs. Some graphs are used more than others, and get special names
			- $K_n$: The complete graph on $n$ vertices
			- $K_{m, n}$: The complete bipartite graph with sets of $m$ and $n$ vertices
			- $C_n$: The cycle on $n$ vertices, just one big loop
			- $P_n$: The path of $n+1$ vertices (so $n$ edges), just one long path
				- Given $P_5$, the 5 is the number of edges
					- 6 vertices in this example
		- A graph is complete if every pair of vertices is connected by one edge and only 1 edge.