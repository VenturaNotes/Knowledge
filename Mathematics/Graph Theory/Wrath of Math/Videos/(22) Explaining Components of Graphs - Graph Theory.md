---
Source:
  - https://youtube.com/watch?v=xzESVEAPICM
---
![[Private/Drawings/drawing-20261102-173505.svg]]
- A connected graph only has one component
- A disconnected graph has multiple components (like the Graph G in the example)
- A component of a graph, G, is a maximal connected subgraph of G.
	- So it means the component of G is a connected subgraph of G that is not a proper subgraph of any other connected subgraph of G
- The $V_1$, $V_2$ and $V_4$ example shown is not a component of G. It is a connected subgraph of G, it is not a maximal connected subgraph of G so its not a component of G. It is only a proper subgraph of some other connected subgraph of G.
- Also, you can't just add an edge between $V_4$ and $V_2$ because then it would no longer be a subgraph of G because that edge doesn't belong to the graph G. When we talk about a component of G, we talk about maximal connected subgraphs of G.
	- So even though a component could not have all possible edges, it does have all possible edges of G that it could have without losing its connected property. 
- So a component is just a maximal connected subgraph. It's a connected subgraph that can't be extended while preserving its connectedness with any other vertices and edges of the graph that's under consideration. 