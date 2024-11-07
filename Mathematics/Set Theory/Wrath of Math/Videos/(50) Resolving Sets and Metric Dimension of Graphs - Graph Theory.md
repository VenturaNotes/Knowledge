[Video](https://youtube.com/watch?v=ESgQnbHTj7c)

- ![[Screenshot 2023-06-01 at 11.06.15 PM.png]]
	- Let G = (V, E) be a connected graph.
		- Vertex set V and Edge set E
		- [[Resolving Sets]] of this graph G
		- Finding [[Metric Dimension]] of graph
	- A vertex u $\in$ V resolves a pair {x, y} $\subseteq$ V if d(u, x) $\ne$ d(u, y).
		- A vertex "u" (of G) resolves a pair of vertices in G if "x" and "y" have distinct distances from that vertex "u"
			- Distance between 2 vertices is the length of a shortest path that connects them
			- This means the vertices "x" and "y" can be uniquely identified by their distance from "u" if they're distance is distinct.
- ![[Screenshot 2023-06-02 at 11.21.07 AM.png]]
	- A set $S \subseteq V$ is a resolving set of G if every pair of vertices in G is resolved by some vertex of S.
	- $r(r|W) = (d(v_,w_1), d(v, w_2), ..., d(v, w_k))$
		- Representation of vertex v with respect to the vertex subset W equal to a K vector or ordered K tuple
		- This is the [[metric representation]] of v with respect to w
	- W is a resolving set of G iff r(u|w) $\ne$ r(v|w) for every u, v $\in$ V where u $\ne$ v
		- Our vertex set W will be a resolving set iff any 2 distinct vertices in our graph have distinct metric representations with respect to W.
			- This means every 2 distinct vertices in the graph will be resolved by some vertex in w.
				- Some vertex in w will have distinct distances from u and v
				- $\therefore$ any 2 vertices in the graph can be uniquely determined by their metric representation with respect to w
- ![[Screenshot 2023-06-02 at 11.25.02 AM.png]]
	- W (in left image) is not a resolving set because not all the vertices of G can be uniquely identified by the representations with respect to W
		- This is because $V_5$ and $V_2$ have the same metric representations with respect to $W$
		- Therefore, no vertex in W resolves $V_5$ and $V_2$
	- Ordering of W is arbitrary but it needs to be consistent
	- W (in right image) is a resolving set of G
- ![[Screenshot 2023-06-02 at 11.31.15 AM.png]]
	- The [[metric dimension]] of G, written dim(G), is the minimum cardinality of a resolving set of G
		- dim(G) is sometimes written as $\beta$(G)
			- but $\beta(G)$ is sometimes used as the vertex covering number of a graph
	- $W' = \{v_1, v_2\}$ is a minimum resolving set of G "a basis for G"
		- The metric dimension of graph G "dim(G) = 2". 2 is the cardinality of a minimum resolving set of G
			- Minimum resolving sets are not necessarily unique
- ![[Screenshot 2023-06-02 at 11.33.38 AM.png|500]] [^1]
	- What is the metric dimension of a [[path graph]]?
		- The answer is that dim(P) = 1 for every path graph P (this excludes the "path" of 0 vertices). This is because every two vertices in a path graph have distinct distances from a single end-vertex of the path graph. So if we let v be an end-vertex of a path graph, then {v} will always be a minimum resolving set of the path graph because no two vertices in the path have equal distances from v and so every pair of vertices in the path is resolved by v.

## References

[^1]: https://mathworld.wolfram.com/PathGraph.html