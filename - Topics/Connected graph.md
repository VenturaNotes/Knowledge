## Synthesis
- 
## Source [^1]
- A graph in which there is a path joining each pair of vertices, the graph being undirected. It is always possible to travel in a connected graph between one vertex and any other; no vertex is isolated. If a graph is not connected it will consist of several components, each of which is connected; such a graph is said to be disconnected.

  

If a graph $G$ has $e$ edges, $v$ vertices, and $p$ components, the rank of $G$, written $\rho(G)$, is defined to be

  

$$

v-p

$$

  

The [[nullity]] of $G$, written $\mu(G)$, is

  

$$

e-v+p

$$

  

Thus $\rho(G)+\mu(G)=e$

  

With reference to a directed graph, a weakly connected graph is one in which the direction of each edge must be removed before the graph can be connected in the manner described above. If however there is a directed path between each pair of vertices $u$ and $v$ and another directed path from $v$ back to $u$, the directed graph is strongly connected.

  

More formally, let $G$ be a directed graph with vertices $V$ and edges $E$. The set $V$ can be partitioned into equivalence classes $V_{1}, V_{2}, \ldots$ under the relation that vertices $u$ and $v$ are equivalent iff there is a path from $u$ to $v$ and another from $v$ to $u$. Let $E_{1}, E_{2}, \ldots$ be the sets of edges connecting vertices within $V_{1}, V_{2}, \ldots$ Then each of the graphs $G_{i}$ with vertices $V_{i}$ and edges $E_{i}$ is a strongly connected component of $G$. A strongly connected graph has precisely one strongly connected component.

  

The process of replacing each of the strongly connected components of a directed graph by a single vertex is known as condensation.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]