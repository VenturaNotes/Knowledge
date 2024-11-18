[Video](https://youtube.com/watch?v=YlJ8plSab6g)

- ![[Screenshot 2023-06-13 at 9.47.13 PM.png]]
	- Let's call a [[Walk|walk]] W
		- A walk is a sequence of vertices in a graph where consecutive vertices are adjacent
			- Some texts will write walks as sequences of vertices, but between each pair of vertices they will also list the edge traversed (the edge that joins the vertices)
		- Every vertex that we traverse in our walk as well as every edge can be said to <mark style="background: #FFF3A3A6;">lie on</mark> the walk <mark style="background: #FFF3A3A6;">W</mark> ^2e807f
			- Can be described as a $V_1 - V_6$ walk
				- Traversed 7 edges
					- W has a <mark style="background: #FFF3A3A6;">length</mark> of 7
						- The [[length of a walk]] is the number of edges distinct or otherwise traversed in the walk
							- It doesn't matter if the edges are distinct or not. It still counts towards the length of the walk
						- W is an [[open walk]]: It's a walk where the first and last vertices are distinct
							- The vertex we start at is not the vertex we end at
		- [[Closed walk]]
			- Where the first and last vertices are equal
		- [[Trivial Walk]]
			- Walk of length 0. Not a single edge is traversed during this walk. $w = (v)$