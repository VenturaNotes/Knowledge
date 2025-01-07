---
Source:
  - https://www.youtube.com/watch?v=WFJ7heLmMKs
Reviewed: false
---
- ![[Screenshot 2025-01-07 at 1.23.43 PM.png]]
	- Lattice Paths
		- How many shortest lattice paths start at $(1,2)$ and satisfies the given conditions
			- (1) Ends at $(10, 10)$
				- Shortest number of paths is $17 \choose 9$
					- This is because $n \choose k$ is the number of lattice paths of length n containing k steps to the right
						- So the shortest path length is 17 and steps to the right is 9
					- #question why is it to the right though and not up?
			- (2) Ends at $(10,10)$ and pass through $(4,5)$
				- First need to find number of paths to $(4,5)$ and then multiply that by number of paths from $(4,5)$ to $(10,10)$ 
			- (3) End at $(10,10)$ and avoid $(4,5)$
				- Just finding the difference here