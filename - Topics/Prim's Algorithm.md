## Synthesis
- 
## Source [^1]
- A method of finding the minimum-cost spanning tree of a weighted undirected graph, developed by R. C. Prim (1957).
## Source[^2]
- (to solve the minimum connector problem) This method is more effective than Kruskal's algorithm when a large number of vertices and/or when the distances are listed in tabular form rather than shown on a graph. Since all vertices will be on the minimum connected route, it does not matter which vertex you choose as a starting point, so make an arbitrary choice, calling it $P_1$ say. Now choose a point with the shortest edge connecting it to $P_1$ and call it $P_2$. At each stage add the edge and new point $P_i$ which adds the shortest distance to the total and does not create any loops. Once $P_n$ has been reached, the minimum connected path has been identified.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]