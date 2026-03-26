## Synthesis
- 
## Source [^1]
- A method of finding the minimum-cost spanning tree of a weighted undirected graph, proposed by J. B. Kruskal Jnr (1956).
## Source[^2]
- (to solve the minimum connector problem) This method is very effective for a small number of vertices for which a full graph is available. Since n vertices will be joined by any spanning tree which has n-1 edges, this method is a simple step-by-step procedure which leads to the one with the smallest total distance. Essentially you start with the shortest edge (and any time there is a tie for the shortest edge, choose either one at random). At each stage add in another edge which connects a new point to the connected tree being built up, without completing a cycle and adding the least distance to the total connected distance, i.e. the shortest edge which connects a new vertex without creating a cycle. Once all vertices have been connected, i.e. once n-1 edges have been taken, the minimum connected path will have been found.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]