[Video](https://youtube.com/watch?v=RfC8sLCHSGE)

- ![[Screenshot 2023-06-13 at 10.01.11 PM.png]]
	- [[Path]]: This is a path because it's a sequence of vertices where consecutive vertices are adjacent in the graph and no vertex is repeated  ^c4db94
		- Can write as a sequence of vertices
		- Consecutive vertices in sequence are adjacent
		- Not allowed to traverse vertices multiple times meaning we're not allowed to traverse edges multiple times as well
	- Sometimes referred to as a [[simple path]]
		- Sometimes put vertex then edge traveled in sequence for path, trail, or walk)
	- In a special type of graph called a "[[multigraph]]", one pair of vertices is allowed to be joined by multiple edges. In that case, the second way is better for defining paths and similar structures
		- First Method: $P = (v_1, v_2, v_3, v_6, v_7, v_8)$
		- Second Method: $P = (v_1, v_1v_2, v_2, v_2v_3, v_3, v_3v_6, v_6, v_6v_7, v_7, v_7v_8,v_8)$
	- There are graphs that we refer to as graphs. We call them [[path graphs]]