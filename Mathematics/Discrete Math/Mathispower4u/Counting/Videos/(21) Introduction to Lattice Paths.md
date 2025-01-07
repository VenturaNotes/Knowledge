---
Source:
  - https://www.youtube.com/watch?v=NT7SshgmJZk
Reviewed: false
---
- ![[Screenshot 2025-01-07 at 1.17.55 PM.png]]
	- Lattice Paths
		- The [[integer lattice]] is the set of all points in the Cartesian plane for which both the x and y coordinates are integers. If you like to draw graphs on graph paper, the lattice is the set of all the intersections of the gridlines. A lattice path is one of the shortest possible paths connecting two points on the lattice, moving only horizontally and vertically. For example, here are three possible lattice paths from the point $(0, 0)$ to $(3, 2)$:
		- Notice to ensure the path is the shortest possible, each move must be either to the right or up. Additionally, in this case, note that no matter what path we take, we must make three steps right and two steps up. No matter what order we make these steps, there will always be 5 steps. Thus each path has length 5.
	- Lattice Paths
		- Counting question: How many shortest lattice paths are there between $(0,0)$ and $(3,2)$? We could try to draw all of these, or instead of drawing them, maybe just list which direction we travel on each of the 5 steps. One path might be RRUUR, UURRR, or RURRU (corresponding to the three paths drawn above).
			- Ups and Rights
		- How many such strings of R's and U's are there? Notice that each of these strings must contain 5 symbols. Exactly 3 of them must be R's (since our destination is 3 units of weight 3. There are 10 of those, so there are 10 lattice paths from (0, 0) to (3, 2)).
			- $n \choose k$ = $|B^n_k|$ is the number n-bit strings of weight $k$
			- $n \choose k$ is the number of lattice paths of length n containing k steps to the right
	- Lattice Paths
		- The correspondence between bit strings and lattice paths does not stop there. Here is another way to count lattice paths. Consider the lattice shown below:
		- Any lattice path from $(0, 0)$ to $(3, 2)$ must pass through exactly one of the A and B. The point A is 4 steps away from $(0,0)$ and two of them are towards the right. The number of lattice paths to A is the same as the number of 4-bit strings of weight 2, namely 6. The point B is 4 steps away from $(0,0)$, but now 3 of them are towards the right. So the number of paths to point B is the same as the number of 4-bit strings of weight 3, namely 4. So the total number of paths to $(3, 2)$ is just 6+4. This is the same way we calculated the number of 5-bit strings of weight 3. The point: the exact same [[recurrence relation]] exists for bit strings and for lattice paths.
			- $n \choose k$ is the number of lattice paths of length n containing k steps to the right. 
				- When we say the number of lattice paths, we are assuming the shortest lattice paths