## Synthesis
- 
## Source [^1]
- (Chinese postman problem) A postman needs to travel along each road, or edge in a graph, while travelling the shortest possible route. If a closed Eulerian trail can be found, it must constitute the minimum possible since it requires each edge to be travelled exactly once, but most graphs do not have such a route available. The best approach is as follows. If all the vertices are of even degree, then there will be an Eulerian trail. If exactly two of the vertices are odd, then use Dijkstra's method of solving the shortest path problem to identify the shortest path between those two vertices, and the postman will have to walk the edges on that route twice and all other edges once. However, when more than two vertices are odd, there are various ways they could be paired off, and what is required is the minimum sum of shortest paths between the pairs. The edges on each of these shortest paths will have to be repeated.
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]