## Synthesis
- 
## Source [^1]
- A two-dimensional array used to store graph data.

## Source[^2]
- (connectivity matrix, reachability matrix) A matrix used as a means of representing an adjacency structure, which in turn represents a graph. If $A$ is the adjacency matrix corresponding to a given graph $G$, then

  

$$

{ }^{a_{i j}=1}

$$

  

if there is an edge from vertex $i$ to vertex $j$ in $G$; otherwise

  

$$

{ }^{a_{i j}=0}

$$

  

If $G$ is a directed graph then

  

if there is an edge directed from vertex $i$ to vertex $j$; otherwise

  

$$

a_{i j}=0

$$

  

If the vertices of the graph are numbered $1,2, \ldots m$, the adjacency matrix is of a type $m \times m$. If

  

$$

A \times A \times \ldots \times A(p \text { terms, } p \leq m)

$$

  

is evaluated, the nonzero entries indicate those vertices that are joined by a path of length $p$; indeed the value of the $(i, j)$ th entry of $A^{p}$ gives the number of paths of length $p$ from the vertex $i$ to vertex $j$. By examining the set of such matrices,

  

$$

p=1,2, \ldots, m-1

$$

  

it can be determined whether two vertices are connected.

It is also possible for adjacency matrices to be formed from Boolean matrices.

## Source[^3]
- For a graph $G$, which $n$ vertices $v_1, v_2, ..., v_n$, the adjacency matrix A is the $n\times n$ matrix $[a_{ij}]$ with $a_{ij}$ equaling the number of edges connecting $v_i$ to $v_j$. The matrix $A$ is symmetric if $G$ is not directed and the sum of any row's (or column's) entries is equal to the degree of the corresponding vertex. An example of a graph and its adjacency matrix $A$ is shown in the figure.
- ![[Screenshot 2025-04-05 at 12.46.55 AM.png]]
	- A graph G
- ![[Screenshot 2025-04-05 at 12.47.10 AM.png]]
	- The adjacency matrix of G
## References

[^1]: [[Home Page - Glossary by ada computer science]]
[^2]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^3]: [[Home Page - The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]