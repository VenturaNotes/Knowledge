---
aliases:
  - graphs
tags:
  - in-progress
---
## Synthesis
- In computer science, a graph is an abstract data type used to model relationships between objects, consisting of a set of nodes (or vertices) and a set of edges that connect these nodes.
## Source [^1]
- (1) A nonempty but finite set of vertices (or nodes) together with a set of edges that join pairs of distinct vertices. If an edge $e$ joins vertices $v_{1}$ and $v_{2}$, then $v_{1}$ and $v_{2}$ are said to be incident with $e$ and the vertices are said to be adjacent; $e$ is the unordered pair $\left(v_{1}, v_{2}\right)$.
- A graph is usually depicted in a pictorial form in which the vertices appear as dots or other shapes, perhaps labelled for identification purposes, and the edges are shown as lines joining the appropriate points. If direction is added to each edge of a graph, a directed graph or digraph is obtained. The edges then form a finite set of ordered pairs of distinct vertices, and are often called [[arc|arcs]]. In the pictorial representation, arrows can be placed on each edge. With no direction specified, the graph is said to be undirected.
- Although helpful visually these representations are not suitable for manipulation by computer. More useful representations use an incidence matrix or an adjacency matrix.
- Graphs are used in a wide variety of ways in computing: the vertices will usually represent objects of some kind and the edges will represent connections of a physical or logical nature between the vertices. So graphs can be used to model in a mathematical fashion such diverse items as a computer and all its attached peripherals, a network of computers, parse trees, logical dependencies between subroutines or nonterminals in a grammar, VLSI diagrams, related items in databases for molecules and reaction networks (for chemoinformatics and bioinformatics). Trees and lists are special kinds of graphs.
- Variations exist in the definition of a graph. There is some dispute about whether one edge can join a vertex to itself, whether empty sets are involved, whether an infinite number of vertices and edges are permitted, and so on.
- See also CONNECTED GRAPH, NETWORK, WEIGHTED GRAPH. 
- (2) (of a function $f$ ) The set of all ordered pairs $(x, y)$ with the property that $y=f(x)$. Often such a graph is represented by a curve.
## Source[^2]
- [ ] (1) How can we represent a general graph that may not well connected for efficient BFS and DFS traversals?
	- 
## Source[^3]
- A number of vertices (or points or nodes), some of which are joined by edges. The edge joining the vertex $U$ and the vertex $V$ may be denoted by $(U, V)$ or $(V, U)$. The vertex-set, that is, the set of vertices, of a graph $G$ may be denoted by $V(G)$ and the edge-set by $E(G)$. For example, the graph shown here on the left has $V(G) = \{U, V, W, X\}$ and $E(G) = \{(U, V), (U, W), (V, W), (W, X)\}$.
- ![[Pasted image 20260905200349.png|239]]
	- A graph
- ![[Pasted image 20260905200404.png|230]]
	- A multigraph
- In general, a graph may have more than one edge joining a pair of vertices; when this occurs, these edges are called multiple edges. Also, a graph may have loops—a loop is an edge that joins a vertex to itself. In the other graph shown, there are $2$ edges joining $V_1$ and $V_3$ and $3$ edges joining $V_2$ and $V_3$; the graph also has three loops. See MULTIGRAPH.
- Normally, $V(G)$ and $E(G)$ are finite, but if this is not so, the result may also be called a graph, though some prefer to call this an infinite graph.
---
- (of a function or mapping) For a function $f : S \to T$ the graph of $f$ is the subset $\{(s, f(s)) \mid s \in S\}$ of the Cartesian product $S \times T$. Note that for each $s \in S$ there is a unique $t \in T$ such that $(s, t)$ is in the graph; some authors define functions as such subsets of the Cartesian product of the domain and codomain. It is common to refer to or label the graph of real function $f : \mathbb{R} \to \mathbb{R}$ as simply $y = f(x)$, and surfaces in $\mathbb{R}^3$ often arise as graphs $z = f(x, y)$.
---
- (of a relation) Let $R$ be a binary relation on a set $S$, so that, when $a$ is related to $b$, this is written $aRb$. The graph of $R$ is the corresponding subset of the Cartesian product $S \times S$, namely the set of all pairs $(a, b)$ such that $aRb$.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: https://www.geeksforgeeks.org/quizzes/graph-12715/
[^3]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]