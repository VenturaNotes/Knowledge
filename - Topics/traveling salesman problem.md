---
aliases:
  - TSP
---
## Synthesis
- 
## Source [^1]
- A well-known graph searching problem. In practical terms the problem can be thought of as that of a salesman who wishes to perform a circular tour of certain cities, calling at each city once only and traveling the minimum total distance possible. In more abstract terms, it is the problem of finding a minimum-weight Hamiltonian cycle in a weighted graph. The problem is known to be NP-complete (see $\mathrm{P}=\mathrm{NP}$ QUESTION).
## Source[^2]
- (TSP) (in graph theory) This is a situation similar to the minimum connector problem but the salesman wishes to return to the starting point (home) at the end, and so essentially the problem is to find a closed walk which visits every vertex and which minimizes the total distance travelled. In practice there can be unusual situations in which the most efficient route is to go $A \to B \to A$ because to get to $B$ from any other vertex, without going through $A$, is difficult. However, the problem is much easier to analyse if the assumption is made that every vertex is visited exactly once, and the problem reduces to finding the Hamiltonian cycle of minimum length. The travelling salesman problem is an NP problem with no known algorithm to solve it in polynomial time, but upper and lower limits are straightforward to find.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]